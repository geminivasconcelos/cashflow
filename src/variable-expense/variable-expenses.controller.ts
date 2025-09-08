import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { VariableExpensesService } from './variable-expenses.service';
import { CreateVariableExpensesDto } from './dto/create-variable-expenses.dto';
import { UpdateVariableExpensesDto } from './dto/update-variable-expenses.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('variable-expenses')
export class VariableExpenseController {
  constructor(private readonly variableExpensesService: VariableExpensesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createVariableExpensesDto: CreateVariableExpensesDto) {
    return this.variableExpensesService.create(req.user.id, createVariableExpensesDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateVariableExpensesDto: UpdateVariableExpensesDto,
  ) {
    return this.variableExpensesService.update(req.user.id, id, updateVariableExpensesDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number) {
    return this.variableExpensesService.remove(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: number) {
    return this.variableExpensesService.findOneByUser(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.variableExpensesService.findAllByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('month/:month/year/:year')
  findByMonthAndYear(
    @Request() req,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.variableExpensesService.findByUserAndMonthAndYear(
      req.user.id,
      month,
      year,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('month/:month/year/:year/category/:category')
  findByMonthAndYearAndCategory(
    @Request() req,
    @Param('month') month: string,
    @Param('year') year: string,
    @Param('category') category: string,
  ) {
    return this.variableExpensesService.findByUserAndMonthAndYearAndCategory(
      req.user.id,
      month,
      year,
      category,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('category/:category')
  findByCategory(
    @Request() req,
    @Param('category') category: string,
  ) {
    return this.variableExpensesService.findByCategory(req.user.id, category);
  }

  @UseGuards(JwtAuthGuard)
  @Get('year/:year')
  findByYear(
    @Request() req,
    @Param('year') year: string,
  ) {
    return this.variableExpensesService.findByUserAndYear(req.user.id, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get('month/:month')
  findByMonth(
    @Request() req,
    @Param('month') month: string,
  ) {
    return this.variableExpensesService.findByUserAndMonth(req.user.id, month);
  }
  }