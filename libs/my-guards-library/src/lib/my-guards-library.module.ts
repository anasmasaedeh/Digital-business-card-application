import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-guard';
import { RolesGuard } from './admin-guard';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis/built/Redis';
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'JwtAuthGuard',
      useClass: JwtAuthGuard,
    },
    Redis,
    {
      provide: 'RoleGuard',
      useClass: RolesGuard,
    },
    JwtService
  ],
  exports: [
  ],
})
export class MyGuardsLibraryModule {}
