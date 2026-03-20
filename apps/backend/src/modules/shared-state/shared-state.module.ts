import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedStateClient } from './shared-state.client';
import { SharedStateController } from './shared-state.controller';
import { SharedStateService } from './shared-state.service';

@Module({
  imports: [ConfigModule],
  controllers: [SharedStateController],
  providers: [SharedStateClient],
  exports: [SharedStateClient, SharedStateService],
})
export class SharedStateModule {}
