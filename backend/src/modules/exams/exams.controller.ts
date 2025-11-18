import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { UploadExamDto } from './dto/upload-exam.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { ExamResponseDto } from './dto/exam-response.dto';
import { JwtAuthGuard } from '../auth/common/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/common/guards/roles.guard';
import { Roles } from '../auth/common/decorators/roles.decorator';
import { CurrentUser } from '../auth/common/decorators/current-user.decorator';
import { UserRole } from '../users/domain/user-role.enum';

@ApiTags('exams')
@ApiBearerAuth()
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ATTENDANT)
  @ApiOkResponse({ type: ExamResponseDto })
  async upload(
    @CurrentUser() user: { id: string },
    @Body() dto: UploadExamDto,
  ) {
    const exam = await this.examsService.uploadExam(user.id, dto);
    return exam;
  }

  @Post(':id/report')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOkResponse({ type: ExamResponseDto })
  async createReport(
    @Param('id') id: string,
    @Body() dto: CreateReportDto,
  ) {
    return this.examsService.createReport(id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [ExamResponseDto] })
  async findAll(@CurrentUser() user: { id: string; role: UserRole }) {
    return this.examsService.getExamsForUser(user.id, user.role);
  }
}