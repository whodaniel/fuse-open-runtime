import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  AgentHeartbeatRequest,
  AgentListResponse,
  AgentStatusResponse,
  GatewayExecuteResponse,
  OrchestratorHealthResponse,
  RegisterAgentRequest,
  RegisterAgentResponse,
  TnfStatusResponse,
} from '@the-new-fuse/control-plane-contracts';

@Injectable()
export class OrchestratorClient {
  private readonly logger = new Logger(OrchestratorClient.name);
  private readonly apiBase: string;
  private readonly execAuthToken: string;

  constructor(private readonly configService: ConfigService) {
    this.apiBase = this.configService.get<string>('ORCHESTRATOR_API_BASE', '');
    this.execAuthToken = this.configService.get<string>('ORCHESTRATOR_EXEC_AUTH', '');

    if (!this.apiBase) {
      this.logger.warn('ORCHESTRATOR_API_BASE not configured');
    }
  }

  /**
   * Expected private control-plane ingress:
   *
   * 1. GET `/orchestrator/health`
   * 2. POST `/orchestrator/register`
   * 3. POST `/orchestrator/heartbeat`
   * 4. GET `/orchestrator/agents`
   * 5. GET `/orchestrator/agents/:agentId`
   * 6. POST `/orchestrator/execute`
   * 7. GET `/orchestrator/tnf-status`
   */
  private buildUrl(path: string): string {
    return `${this.apiBase.replace(/\/+$/, '')}${path}`;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    if (!this.apiBase) {
      throw new Error('Orchestrator API not configured');
    }

    const response = await fetch(this.buildUrl(path), init);
    const body = (await response.json().catch(() => null)) as T | null;

    if (!response.ok || body === null) {
      throw new Error(`ORCHESTRATOR_API_ERROR:${response.status}`);
    }

    return body;
  }

  async getSystemHealth(): Promise<OrchestratorHealthResponse> {
    if (!this.apiBase) {
      return {
        status: 'operational',
        timestamp: new Date().toISOString(),
        metrics: {
          totalAgents: 0,
          activeAgents: 0,
          stalledAgents: 0,
          failedAgents: 0,
        },
      };
    }

    return this.request<OrchestratorHealthResponse>('/orchestrator/health');
  }

  async registerAgent(dto: RegisterAgentRequest): Promise<RegisterAgentResponse> {
    return this.request<RegisterAgentResponse>('/orchestrator/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(dto),
    });
  }

  async recordAgentHeartbeat(
    dto: AgentHeartbeatRequest
  ): Promise<{ success: boolean; received: string }> {
    return this.request<{ success: boolean; received: string }>('/orchestrator/heartbeat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(dto),
    });
  }

  async getAllAgents(): Promise<AgentListResponse> {
    if (!this.apiBase) {
      return { agents: [], count: 0, message: 'Orchestrator API not configured' };
    }

    return this.request<AgentListResponse>('/orchestrator/agents');
  }

  async getAgentStatus(agentId: string): Promise<AgentStatusResponse> {
    if (!this.apiBase) {
      return { error: 'Orchestrator API not configured' };
    }

    return this.request<AgentStatusResponse>(`/orchestrator/agents/${encodeURIComponent(agentId)}`);
  }

  async executeGatewayPrompt(input: {
    requestId: string;
    idempotencyKey?: string;
    sessionId?: string;
    text: string;
    channel?: string;
    userId?: string;
  }): Promise<Pick<GatewayExecuteResponse, 'replyText' | 'metadata'>> {
    const authorization = this.execAuthToken ? `Bearer ${this.execAuthToken}` : undefined;

    return this.request<GatewayExecuteResponse>('/orchestrator/execute', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(authorization ? { authorization } : {}),
      },
      body: JSON.stringify({
        channel: (input.channel || 'telegram') as 'telegram',
        requestId: input.requestId,
        idempotencyKey: input.idempotencyKey,
        sessionId: input.sessionId,
        update: {
          message: {
            text: input.text,
            from: input.userId ? { id: input.userId } : undefined,
          },
        },
      }),
    });
  }

  async getTNFStatus(): Promise<TnfStatusResponse> {
    if (!this.apiBase) {
      return {
        identity: 'TNF Core - The New Fuse Master Agent',
        description: 'Public orchestrator facade; private control-plane not configured',
        status: 'unconfigured',
        systemHealth: null,
        capabilities: [],
        timestamp: new Date().toISOString(),
      };
    }

    return this.request<TnfStatusResponse>('/orchestrator/tnf-status');
  }
}
