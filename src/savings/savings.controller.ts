import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SavingsService } from './savings.service';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post()
  create(@Body() createSavingsDto: CreateSavingsDto) {
    return this.savingsService.create(createSavingsDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSavingsDto: UpdateSavingsDto) {
    return this.savingsService.update(id, updateSavingsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.savingsService.remove(id);
  }

  @Get()
  findAll() {
    return this.savingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.savingsService.findOne(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.savingsService.findByUser(userId);
  }

  @Get('user/:userId/year/:year')
  findByUserAndYear(
    @Param('userId') userId: number,
    @Param('year') year: number,
  ) {
    return this.savingsService.findByUserAndYear(userId, year);
  }

  @Get('user/:userId/month/:month/year/:year')
  findByUserAndMonth(
    @Param('userId') userId: number,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.savingsService.findByUserAndMonthAndYear(userId, month, year);
  }

  @Get('total/user/:userId')
  findTotalByUser(@Param('userId') userId: number) {
    return this.savingsService.findTotalByUser(userId);
  }

  @Get('total/user/:userId/month/:month')
  findTotalByUserAndMonth(
    @Param('userId') userId: number,
    @Param('month') month: string,
  ) {
    return this.savingsService.findTotalByUserAndMonth(userId, month);
  }

  @Get('total/user/:userId/year/:year')
  findTotalByUserAndYear(
    @Param('userId') userId: number,
    @Param('year') year: string,
  ) {
    return this.savingsService.findTotalByUserAndYear(userId, year);
  }

  @Get('total/user/:userId/month/:month/year/:year')
  findTotalByUserAndMonthAndYear(
    @Param('userId') userId: number,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.savingsService.findTotalByUserAndMonthAndYear(userId, month, year);
  }
}
