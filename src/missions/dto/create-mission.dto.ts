// src/missions/dto/create-mission.dto.ts
import { IsString, IsOptional, IsInt, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMissionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsInt()
  tjm: number;

  @Type(() => Number)
  @IsInt()
  duree: number;

  @IsString()
  client: string;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  startDate?: Date;
}
