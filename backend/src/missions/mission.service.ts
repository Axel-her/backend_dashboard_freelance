import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';


@Injectable()
export class MissionService {

  constructor(private readonly prismaService: PrismaService) {}

  async createMission(createMissionDto: CreateMissionDto, userId: number): Promise<Mission> {
    return this.prismaService.getPrisma().mission.create({
      data: { ...createMissionDto, userId },
    });
  }

  async findAllMissions(userId: number): Promise<Mission[]> {
    return this.prismaService.getPrisma().mission.findMany({ where: { userId } });
  }

  // secure: retourne uniquement si la mission appartient à userId
  async findOneMissionForUser(userId: number, id: number): Promise<Mission> {
    const mission = await this.prismaService.getPrisma().mission.findFirst({ where: { id, userId } });
    if (!mission) throw new NotFoundException('Mission not found or not owned');
    return mission;
  }

  async updateMissionForUser(userId: number, id: number, updateMissionDto: UpdateMissionDto): Promise<Mission> {
    const updated = await this.prismaService.getPrisma().mission.updateMany({
      where: { id, userId },
      data: updateMissionDto,
    });
    if (updated.count === 0)
    throw new NotFoundException('Mission not found or not owned');
  // On récupère la mission mise à jour pour la renvoyer
  const mission = await this.prismaService.getPrisma().mission.findUnique({
    where: { id },
  });
  if (!mission) throw new NotFoundException('Mission not found after update');
   return mission;
}

  async removeMissionForUser(userId: number, id: number): Promise<void> {
    const deleted = await this.prismaService.getPrisma().mission.deleteMany({ where: { id, userId } });
    if (deleted.count === 0) throw new NotFoundException('Mission not found or not owned');
  }
}