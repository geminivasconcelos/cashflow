import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateFixedExpensesDto } from './dto/create-fixed-expenses.dto';
import { UpdateFixedExpensesDto } from './dto/update-fixed-expenses.dto';
import { FixedExpensesService } from './fixed-expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('fixed-expenses')
export class FixedExpensesController {
  constructor(private readonly fixedExpensesService: FixedExpensesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createFixedExpensesDto: CreateFixedExpensesDto,
  ) {
    return this.fixedExpensesService.create(
      req.user.id,
      createFixedExpensesDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateFixedExpensesDto: UpdateFixedExpensesDto,
  ) {
    return this.fixedExpensesService.update(
      req.user.id,
      id,
      updateFixedExpensesDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: number) {
    return this.fixedExpensesService.remove(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: number) {
    return this.fixedExpensesService.findOneByUser(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.fixedExpensesService.findAllByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('month/:month/year/:year')
  findByMonthAndYear(
    @Request() req,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.fixedExpensesService.findByUserAndMonthAndYear(
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
    return this.fixedExpensesService.findByUserAndMonthAndYearAndCategory(
      req.user.id,
      month,
      year,
      category,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('category/:category')
  findByCategory(@Request() req, @Param('category') category: string) {
    return this.fixedExpensesService.findByCategory(req.user.id, category);
  }

  @UseGuards(JwtAuthGuard)
  @Get('year/:year')
  findByYear(@Request() req, @Param('year') year: string) {
    return this.fixedExpensesService.findByUserAndYear(req.user.id, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get('month/:month')
  findByMonth(@Request() req, @Param('month') month: string) {
    return this.fixedExpensesService.findByUserAndMonth(req.user.id, month);
  }
}
