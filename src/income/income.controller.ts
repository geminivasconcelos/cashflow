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
  findAll() {
    return this.incomeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.incomeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.incomeService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.incomeService.findByCategory(category);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId/month/:month')
  findByUserAndMonth(
    @Param('userId') userId: number,
    @Param('month') month: string,
  ) {
    return this.incomeService.findByUserAndMonth(userId, month);
  }

   @UseGuards(JwtAuthGuard)
  @Get('user/:userId/month/:month')
  findByUserAndMonthAndYear(
    @Param('userId') userId: number,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.incomeService.findByUserAndMonthAndYear(userId, month, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId/month/:month/category/:category')
  findByUserAndMonthAndCategory(
    @Param('userId') userId: number,
    @Param('month') month: string,
    @Param('category') category: string,
  ) {
    return this.incomeService.findByUserAndMonthAndCategory(
      userId,
      month,
      category,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomeService.update(id, updateIncomeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.incomeService.delete(id);
  }
}
