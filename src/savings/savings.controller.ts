import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SavingsService } from './savings.service';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSavingsDto: CreateSavingsDto) {
    return this.savingsService.create(createSavingsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSavingsDto: UpdateSavingsDto) {
    return this.savingsService.update(id, updateSavingsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.savingsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.savingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.savingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.savingsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId/year/:year')
  findByUserAndYear(
    @Param('userId') userId: number,
    @Param('year') year: number,
  ) {
    return this.savingsService.findByUserAndYear(userId, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId/month/:month/year/:year')
  findByUserAndMonth(
    @Param('userId') userId: number,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.savingsService.findByUserAndMonthAndYear(userId, month, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get('total/user/:userId')
  findTotalByUser(@Param('userId') userId: number) {
    return this.savingsService.findTotalByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('total/user/:userId/month/:month')
  findTotalByUserAndMonth(
    @Param('userId') userId: number,
    @Param('month') month: string,
  ) {
    return this.savingsService.findTotalByUserAndMonth(userId, month);
  }

  @UseGuards(JwtAuthGuard)
  @Get('total/user/:userId/year/:year')
  findTotalByUserAndYear(
    @Param('userId') userId: number,
    @Param('year') year: string,
  ) {
    return this.savingsService.findTotalByUserAndYear(userId, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get('total/user/:userId/month/:month/year/:year')
  findTotalByUserAndMonthAndYear(
    @Param('userId') userId: number,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.savingsService.findTotalByUserAndMonthAndYear(userId, month, year);
  }
}
