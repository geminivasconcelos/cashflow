import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateFixedExpensesDto } from './dto/create-fixed-expenses.dto';
import { UpdateFixedExpensesDto } from './dto/update-fixed-expenses.dto';
import { FixedExpensesService } from './fixed-expenses.service';

@Controller('fixed-expenses')
export class FixedExpensesController {
  constructor(private readonly fixedExpensesService: FixedExpensesService) {}

  @Post()
  create(@Body() createFixedExpensesDto: CreateFixedExpensesDto) {
    return this.fixedExpensesService.create(createFixedExpensesDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateFixedExpensesDto: UpdateFixedExpensesDto,
  ) {
    return this.fixedExpensesService.update(id, updateFixedExpensesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.fixedExpensesService.remove(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.fixedExpensesService.findOne(id);
  }

  @Get()
  findAll() {
    return this.fixedExpensesService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.fixedExpensesService.findByUser(userId);
  }

  @Get('user/:userId/month/:month/year/:year')
  findByUserAndMonthAndYear(
    @Param('userId') userId: number,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.fixedExpensesService.findByUserAndMonthAndYear(
      userId,
      month,
      year,
    );
  }

  @Get('user/:userId/month/:month/year/:year/category/:category')
  findByUserAndMonthAndYearAndCategory(
    @Param('userId') userId: number,
    @Param('month') month: string,
    @Param('year') year: string,
    @Param('category') category: string,
  ) {
    return this.fixedExpensesService.findByUserAndMonthAndYearAndCategory(
      userId,
      month,
      year,
      category,
    );
  }

  @Get('user/:userId/category/:category')
  findByCategory(
    @Param('userId') userId: number,
    @Param('category') category: string,
  ) {
    return this.fixedExpensesService.findByCategory(userId, category);
  }

  @Get('user/:userId/year/:year')
  findByUserAndYear(
    @Param('userId') userId: number,
    @Param('year') year: string,
  ) {
    return this.fixedExpensesService.findByUserAndYear(userId, year);
  }

  @Get('user/:userId/month/:month')
  findByUserAndMonth(
    @Param('userId') userId: number,
    @Param('month') month: string,
  ) {
    return this.fixedExpensesService.findByUserAndMonth(userId, month);
  }
}
