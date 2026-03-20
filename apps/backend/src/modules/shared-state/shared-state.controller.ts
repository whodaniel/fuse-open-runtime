import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { SharedStateDepositRequest } from '@the-new-fuse/control-plane-contracts';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { SharedStateClient } from './shared-state.client';

@ApiTags('Shared State')
@Controller('shared-state')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SharedStateController {
  constructor(private readonly sharedStateClient: SharedStateClient) {}

  @Get('health')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin facade for Cloudflare SharedState worker health' })
  async checkHealth() {
    return this.sharedStateClient.checkHealth();
  }

  @Post('deposit')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin facade for depositing a receipt to SharedState' })
  async deposit(@Body() receipt: SharedStateDepositRequest) {
    return this.sharedStateClient.deposit(receipt);
  }

  @Get('context/:runtime')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Admin facade for fetching runtime context from SharedState' })
  async getContext(@Param('runtime') runtime: string) {
    return this.sharedStateClient.getContext(runtime);
  }
}
