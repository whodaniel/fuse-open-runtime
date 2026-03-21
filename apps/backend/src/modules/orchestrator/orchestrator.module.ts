import { Module } from '@nestjs/common';
import { OrchestratorController } from './orchestrator.controller';
import { OrchestratorClient } from './orchestrator.client';

@Module({
  controllers: [OrchestratorController],
  providers: [OrchestratorClient],
  exports: [OrchestratorClient],
})
export class OrchestratorModule {}
