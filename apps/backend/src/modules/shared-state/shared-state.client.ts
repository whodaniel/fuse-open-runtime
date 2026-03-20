import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import type {
  DepositResponse,
  SharedStateContextResponse,
  SharedStateDepositRequest,
  SharedStateHealthResponse,
} from '@the-new-fuse/control-plane-contracts';

const SAFE_RUNTIME_PATTERN = /^[a-zA-Z0-9_-]+$/;

@Injectable()
export class SharedStateClient {
  private readonly logger = new Logger(SharedStateClient.name);
  private readonly apiBase: string;
  private readonly authToken: string;

  constructor(private readonly configService: ConfigService) {
    this.apiBase = this.configService.get<string>('SHAREDSTATE_API_BASE', '');
    this.authToken = this.configService.get<string>('SHAREDSTATE_AUTH_TOKEN', '');

    if (!this.apiBase) {
      this.logger.warn('SHAREDSTATE_API_BASE not configured');
    }
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'x-auth-token': this.authToken,
    };
  }

  async deposit(receipt: SharedStateDepositRequest): Promise<DepositResponse> {
    if (!this.apiBase) {
      throw new Error('SharedState API not configured');
    }

    try {
      const response = await axios.post<DepositResponse>(`${this.apiBase}/deposit`, receipt, {
        headers: this.headers,
      });
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to deposit receipt: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getContext(runtime: string): Promise<SharedStateContextResponse> {
    if (!this.apiBase) {
      throw new Error('SharedState API not configured');
    }

    if (!SAFE_RUNTIME_PATTERN.test(runtime)) {
      throw new BadRequestException('Invalid runtime identifier');
    }

    try {
      const response = await axios.get<SharedStateContextResponse>(
        `${this.apiBase}/context/${encodeURIComponent(runtime)}?inline=1`,
        {
          headers: this.headers,
        }
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to fetch context for ${runtime}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async checkHealth(): Promise<SharedStateHealthResponse> {
    if (!this.apiBase) return { status: 'disabled' };
    try {
      const response = await axios.get<SharedStateHealthResponse>(`${this.apiBase}/health`);
      return response.data;
    } catch (error: any) {
      return { status: 'down', error: error.message };
    }
  }
}
