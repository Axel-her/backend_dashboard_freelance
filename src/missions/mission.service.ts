import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import {Mission} from '@prisma/client';
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
    const mission = await this.prismaService.getPrisma().mission.findUnique({ where: { id: id } });
    if (!mission || mission.userId !== userId) throw new NotFoundException('Mission not found or not owned');
    return mission;
  }

  async updateMissionForUser(userId: number, id: number, updateMissionDto: UpdateMissionDto): Promise<Mission> {
    const updated = await this.prismaService.getPrisma().mission.updateMany({
      where: { id, userId },
      data: updateMissionDto,
    });
    if (updated.count === 0) {
      throw new NotFoundException('Mission not found or not owned');
    }
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

  async getDashboardData(userId: number) {
    const missions = await this.findAllMissions(userId);

    const totalRevenue = missions.reduce((sum, mission) => sum + (mission.tjm * mission.duree), 0);
    const numberOfMissions = missions.length;
    const numberOfClients = new Set(missions.map(m => m.client)).size;

    const latestMissions = missions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    return {
      totalRevenue,
      numberOfMissions,
      numberOfClients,
      latestMissions,
    };
  }

  async getMissionsPaginated(userId: number, page: number, limit: number, year?: number) {
    const missions = await this.findAllMissions(userId);
    let filteredMissions = missions;

    // Filtrer par année si spécifiée
    if (year) {
      filteredMissions = missions.filter(mission => {
        if (!mission.startDate) return false;
        const missionYear = new Date(mission.startDate).getFullYear();
        return missionYear === year;
      });
    }

    const sortedMissions = filteredMissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = sortedMissions.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMissions = sortedMissions.slice(startIndex, endIndex);

    return {
      missions: paginatedMissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAvailableYears(userId: number): Promise<number[]> {
    const missions = await this.findAllMissions(userId);
    const years = new Set<number>();
    missions.forEach(mission => {
      if (mission.startDate) {
        years.add(new Date(mission.startDate).getFullYear());
      }
    });
    return Array.from(years).sort((a, b) => b - a); // Trier par année décroissante
  }
}