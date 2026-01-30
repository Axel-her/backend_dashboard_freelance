import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req, Query, ParseIntPipe } from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';


@UseGuards(AuthGuard('jwt'))
@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('dashboard')
  getDashboard(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.missionService.getDashboardData(userId);
  }

  @Get('paginated')
  getMissionsPaginated(@Query('page') page: string, @Query('limit') limit: string, @Req() req: Request, @Query('year') year?: string) {
    const userId = (req.user as any).userId;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const yearNum = year ? parseInt(year, 10) : undefined;
    return this.missionService.getMissionsPaginated(userId, pageNum, limitNum, yearNum);
  }

  @Get('years')
  getAvailableYears(@Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.missionService.getAvailableYears(userId);
  }

  @Post()
  create(@Body() createMissionDto: CreateMissionDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.missionService.createMission(createMissionDto, userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.missionService.findOneMissionForUser(userId, Number(id));
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMissionDto: UpdateMissionDto, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.missionService.updateMissionForUser(userId, Number(id), updateMissionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = (req.user as any).userId;
    return this.missionService.removeMissionForUser(userId, Number(id));
  }

}