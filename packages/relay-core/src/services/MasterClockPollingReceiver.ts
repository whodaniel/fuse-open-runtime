import { EventEmitter } from 'events';
import type { RegisterClockNodeRequest } from '@the-new-fuse/control-plane-contracts';
import { Logger } from '../utils/Logger';
import { MasterClockControlClient } from './MasterClockControlClient';
import {
  MasterClockSignalReceiver,
  type MasterClockReceiveResult,
} from './MasterClockSignalReceiver';

export interface MasterClockPollingReceiverOptions {
  client: MasterClockControlClient;
  receiver: MasterClockSignalReceiver;
  logger: Logger;
  pollIntervalMs?: number;
  autoRegister?: boolean;
  registration?: RegisterClockNodeRequest;
}

export class MasterClockPollingReceiver extends EventEmitter {
  private readonly client: MasterClockControlClient;
  private readonly receiver: MasterClockSignalReceiver;
  private readonly logger: Logger;
  private readonly pollIntervalMs: number;
  private readonly autoRegister: boolean;
  private readonly registration?: RegisterClockNodeRequest;
  private pollTimer?: NodeJS.Timeout;
  private inFlight = false;
  private lastProcessedSignalId = '';

  constructor(options: MasterClockPollingReceiverOptions) {
    super();
    this.client = options.client;
    this.receiver = options.receiver;
    this.logger = options.logger;
    this.pollIntervalMs = options.pollIntervalMs ?? 15_000;
    this.autoRegister = options.autoRegister ?? true;
    this.registration = options.registration;
  }

  async start(): Promise<void> {
    if (this.autoRegister && this.registration) {
      await this.client.registerNode(this.registration);
      this.logger.info(
        `[MasterClockReceiver] Registered collective node ${this.registration.node_id}`
      );
    }

    await this.pollOnce();
    this.pollTimer = setInterval(() => {
      void this.pollOnce();
    }, this.pollIntervalMs);
  }

  async stop(): Promise<void> {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = undefined;
    }
  }

  async pollOnce(): Promise<MasterClockReceiveResult | null> {
    if (this.inFlight) {
      return null;
    }
    this.inFlight = true;

    try {
      const signal = await this.client.getLatestSignal(this.receiver.getNodeId());
      if (!signal) {
        return null;
      }

      if (signal.payload.signal_id === this.lastProcessedSignalId) {
        return null;
      }

      const result = await this.receiver.receive(signal);
      await this.client.acknowledgeSignal(result.ack);
      this.lastProcessedSignalId = result.ack.signal_id;
      this.emit('signal_processed', result);
      return result;
    } catch (error) {
      this.emit('signal_error', error);
      this.logger.error(
        `[MasterClockReceiver] Poll failure: ${error instanceof Error ? error.message : String(error)}`
      );
      return null;
    } finally {
      this.inFlight = false;
    }
  }
}
