/**
 * Orchestrator Controller
 *
 * REST API endpoints for the TNF orchestration system.
 * Allows agents to register, send heartbeats, and check system health.
 */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type {
  AgentHeartbeatRequest,
  AgentListResponse,
  AgentStatusResponse,
  GatewayExecuteRequest,
  GatewayExecuteResponse,
  OrchestratorHealthResponse,
  RegisterAgentRequest,
  RegisterAgentResponse,
  TnfStatusResponse,
} from '@the-new-fuse/control-plane-contracts';
import { OrchestratorClient } from './orchestrator.client';

interface ActivityDto {
  agentId: string;
  activityType: string;
  metadata?: Record<string, unknown>;
}

@ApiTags('orchestrator')
@Controller('orchestrator')
export class OrchestratorController {
  private readonly logger = new Logger('OrchestratorController');

  constructor(
    private readonly orchestratorClient: OrchestratorClient,
    private readonly configService: ConfigService
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Get system health and agent metrics' })
  @ApiResponse({ status: 200, description: 'System health metrics' })
  async getSystemHealth(): Promise<OrchestratorHealthResponse> {
    return this.orchestratorClient.getSystemHealth();
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new agent for heartbeat monitoring' })
  @ApiResponse({ status: 201, description: 'Agent registered successfully' })
  async registerAgent(@Body() dto: RegisterAgentRequest): Promise<RegisterAgentResponse> {
    this.logger.log(`📝 Registering agent: ${dto.agentId} (${dto.agentName || 'unnamed'})`);

    return this.orchestratorClient.registerAgent(dto);
  }

  @Post('heartbeat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record a heartbeat from an agent' })
  @ApiResponse({ status: 200, description: 'Heartbeat recorded' })
  async recordHeartbeat(
    @Body() dto: AgentHeartbeatRequest
  ): Promise<{ success: boolean; received: string }> {
    return this.orchestratorClient.recordAgentHeartbeat(dto);
  }

  @Get('agents')
  @ApiOperation({ summary: 'Get all registered agents and their status' })
  @ApiResponse({ status: 200, description: 'List of all agents' })
  async getAllAgents(): Promise<AgentListResponse> {
    return this.orchestratorClient.getAllAgents();
  }

  @Get('agents/:agentId')
  @ApiOperation({ summary: 'Get status of a specific agent' })
  @ApiResponse({ status: 200, description: 'Agent status' })
  async getAgentStatus(@Param('agentId') agentId: string): Promise<AgentStatusResponse> {
    return this.orchestratorClient.getAgentStatus(agentId);
  }

  @Post('execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Gateway execution endpoint for channel ingress (idempotent by requestId/idempotencyKey)',
  })
  @ApiResponse({ status: 200, description: 'Execution response with replyText' })
  async execute(
    @Body() dto: GatewayExecuteRequest,
    @Headers('authorization') authorization?: string
  ) {
    const requiredToken = this.configService.get<string>('ORCHESTRATOR_EXEC_AUTH');
    if (requiredToken) {
      const got = authorization || '';
      if (got !== `Bearer ${requiredToken}`) {
        throw new UnauthorizedException('UNAUTHORIZED');
      }
    }

    const text = dto?.update?.message?.text;
    if (!text || typeof text !== 'string' || !text.trim()) {
      throw new BadRequestException('MESSAGE_TEXT_REQUIRED');
    }

    const result = await this.orchestratorClient.executeGatewayPrompt({
      requestId: dto.requestId,
      idempotencyKey: dto.idempotencyKey,
      sessionId: dto.sessionId,
      text,
      channel: dto.channel,
      userId: dto?.update?.message?.from?.id ? String(dto.update.message.from.id) : undefined,
    });

    return {
      ok: true,
      requestId: dto.requestId,
      replyText: result.replyText,
      metadata: result.metadata,
    } as GatewayExecuteResponse;
  }

  @Get('tnf-status')
  @ApiOperation({ summary: 'Get TNF Core Agent status (The New Fuse as Master Agent)' })
  @ApiResponse({ status: 200, description: 'TNF Core status' })
  async getTNFStatus(): Promise<TnfStatusResponse> {
    return this.orchestratorClient.getTNFStatus();
  }
}
