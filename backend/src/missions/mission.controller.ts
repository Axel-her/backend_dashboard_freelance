import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { MissionService } from './mission.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

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
