import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Post()
  create(@Body() createMissionDto: CreateMissionDto) {
    return this.missionService.createMission(createMissionDto);
  }

  @Get()
  findAll() {
    return this.missionService.findAllMissions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionService.findOneMission(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMissionDto: UpdateMissionDto) {
    return this.missionService.updateMission(Number(id), updateMissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionService.removeMission(Number(id));
  }
}