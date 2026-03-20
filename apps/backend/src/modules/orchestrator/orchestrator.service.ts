import { Injectable } from '@nestjs/common';
import type {
  AgentHeartbeatRequest,
  RegisterAgentRequest,
  SystemHealthMetrics,
} from '@the-new-fuse/control-plane-contracts';
import { OrchestratorClient } from './orchestrator.client';

export interface HeartbeatConfig {
  intervalMs: number;
  timeoutMs: number;
  maxRetries: number;
  escalationDelay: number;
  stagnationThresholdMs: number;
}

export interface AgentHeartbeat {
  agentId: string;
  lastHeartbeat: Date;
  lastActivity: Date;
  status: 'active' | 'idle' | 'stalled' | 'failed';
  consecutiveFailures: number;
  currentTask?: string;
  expectedResponseTime?: number;
}

export interface StagnationAlert {
  agentId: string;
  taskId: string;
  stagnationType: 'no_heartbeat' | 'no_progress' | 'circular_communication' | 'timeout';
  detectedAt: Date;
  duration: number;
  severity: 'warning' | 'critical' | 'emergency';
}

/**
 * Compatibility shim.
 *
 * The authority-bearing orchestrator service now belongs behind the private
 * control-plane API. This class preserves the existing backend module surface
 * while delegating public interactions through OrchestratorClient.
 */
@Injectable()
export class HeartbeatMonitoringService {
  getAgentStatus(_agentId: string): AgentHeartbeat | undefined {
    return undefined;
  }

  getAllAgentStatuses(): Map<string, AgentHeartbeat> {
    return new Map();
  }

  getHealthMetrics(): SystemHealthMetrics {
    return {
      totalAgents: 0,
      activeAgents: 0,
      stalledAgents: 0,
      failedAgents: 0,
    };
  }

  registerAgent(_agentId: string, _expectedResponseTime?: number): void {}

  recordHeartbeat(_agentId: string, _taskId?: string): void {}

  recordActivity(
    _agentId: string,
    _activityType: string,
    _metadata?: Record<string, unknown>
  ): void {}
}

export class OrchestratorService extends OrchestratorClient {
  private readonly heartbeatService = new HeartbeatMonitoringService();

  getHeartbeatService(): HeartbeatMonitoringService {
    return this.heartbeatService;
  }

  async registerAgent(
    input: string | RegisterAgentRequest,
    expectedResponseTime?: number
  ): Promise<any> {
    const dto =
      typeof input === 'string'
        ? ({ agentId: input, expectedResponseTimeMs: expectedResponseTime } as RegisterAgentRequest)
        : input;
    return super.registerAgent(dto);
  }

  async recordAgentHeartbeat(input: string | AgentHeartbeatRequest, taskId?: string): Promise<any> {
    const dto =
      typeof input === 'string' ? ({ agentId: input, taskId } as AgentHeartbeatRequest) : input;
    return super.recordAgentHeartbeat(dto);
  }

  async getSystemHealth(): Promise<SystemHealthMetrics | null> {
    const health = await super.getSystemHealth();
    return health.metrics;
  }
}
