import { Module } from '@nestjs/common';
import { MissionService } from './mission.service';
import { MissionController } from './mission.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [MissionService, PrismaService],
  controllers: [MissionController],
})
export class MissionModule {}
