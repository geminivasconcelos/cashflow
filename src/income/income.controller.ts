import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeService } from './income.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto) {
    return this.incomeService.create(createIncomeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllByUser(@Request() req) {
    return this.incomeService.findAllByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.incomeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('category/:category')
  findByCategory(@Request() req, @Param('category') category: string) {
    return this.incomeService.findByUserAndCategory(req.user.id, category);
  }

  @UseGuards(JwtAuthGuard)
  @Get('month/:month')
  findByMonth(@Request() req, @Param('month') month: string) {
    return this.incomeService.findByUserAndMonth(req.user.id, month);
  }

  @UseGuards(JwtAuthGuard)
  @Get('year/:year')
  findByYear(@Request() req, @Param('year') year: string) {
    return this.incomeService.findByUserAndYear(req.user.id, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get('month/:month/year/:year')
  findByMonthAndYear(
    @Request() req,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.incomeService.findByUserAndMonthAndYear(
      req.user.id,
      month,
      year,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('month/:month/category/:category')
  findByMonthAndCategory(
    @Request() req,
    @Param('month') month: string,
    @Param('category') category: string,
  ) {
    return this.incomeService.findByUserAndMonthAndCategory(
      req.user.id,
      month,
      category,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ) {
    return this.incomeService.update(req.user.id, id, updateIncomeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Request() req, @Param('id') id: number) {
    return this.incomeService.delete(req.user.id, id);
  }
}
