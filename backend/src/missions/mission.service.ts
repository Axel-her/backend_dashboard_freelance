import { Injectable } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async createMission(createMissionDto: CreateMissionDto): Promise<Mission> {
    return this.prismaService.getPrisma().mission.create({ data: createMissionDto });
  }

  async findAllMissions(): Promise<Mission[]> {
    return this.prismaService.getPrisma().mission.findMany();
  }

  async findOneMission(id: number): Promise<Mission> {
    return this.prismaService.getPrisma().mission.findUniqueOrThrow({ where: { id } });
  }


  async updateMission(id: number, updateMissionDto: UpdateMissionDto): Promise<Mission> {
    return this.prismaService.getPrisma().mission.update({ where: { id }, data: updateMissionDto });
  }

  async removeMission(id: number): Promise<void> {
    await this.prismaService.getPrisma().mission.delete({ where: { id } });
  }
}