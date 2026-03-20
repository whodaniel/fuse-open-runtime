import { Module } from '@nestjs/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorClient } from './orchestrator.client';
import { OrchestratorService } from './orchestrator.service';
import { RedisLockService } from '../../services/redis-lock.service';

@Module({
  controllers: [OrchestratorController],
  providers: [RedisLockService, OrchestratorClient, OrchestratorService],
  exports: [OrchestratorClient, OrchestratorService],
})
export class OrchestratorModule {}
