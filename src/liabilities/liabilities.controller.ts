import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { LiabilitiesService } from './liabilities.service';
import { CreateLiabilityDto } from './dto/create-liabilities.dto';
import { UpdateLiabilityDto } from './dto/update-liabilities.dto';

@Controller('liabilities')
export class LiabilitiesController {
  constructor(private readonly liabilitiesService: LiabilitiesService) {}

  @Post()
  create(@Body() createLiabilityDto: CreateLiabilityDto) {
    return this.liabilitiesService.create(createLiabilityDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLiabilityDto: UpdateLiabilityDto,
  ) {
    return this.liabilitiesService.update(id, updateLiabilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liabilitiesService.remove(id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: number) {
    const userId = req.user.id;
    return this.liabilitiesService.findOneByUser(id, userId);
  }

  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.liabilitiesService.findByUser(userId);
  }

  @Get('status/:status')
  findByStatus(@Request() req, @Param('status') status: string) {
    const userId = req.user.id;
    return this.liabilitiesService.findByUserAndStatus(userId, status);
  }

  @Get('summary')
  findUserSummary(@Request() req) {
    const userId = req.user.id;
    return this.liabilitiesService.findUserSummary(userId);
  }

  @Get('search/:keyword')
  findByKeyword(@Request() req, @Param('keyword') keyword: string) {
    const userId = req.user.id;
    return this.liabilitiesService.findByKeyword(userId, keyword);
  }

  @Get('filter/amount')
  findByAmountRange(
    @Request() req,
    @Query('min') min: number,
    @Query('max') max: number,
  ) {
    const userId = req.user.id;
    return this.liabilitiesService.findByAmountRange(userId, min, max);
  }

  @Get('filter/installments-due/:min/:max')
  findByInstallmentsDue(
    @Request() req,
    @Param('min') min: number,
    @Param('max') max: number,
  ) {
    const userId = req.user.id;
    return this.liabilitiesService.findByInstallmentsDue(userId, min, max);
  }

  @Get('filter/created-between')
  findByDateRange(
    @Request() req,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    const userId = req.user.id;
    return this.liabilitiesService.findByDateRange(userId, start, end);
  }
}
