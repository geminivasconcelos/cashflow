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
import { SavingsService } from './savings.service';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { UpdateSavingsDto } from './dto/update-savings.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post()
  createSavings(@Request() req, @Body() createSavingsDto: CreateSavingsDto) {
    return this.savingsService.create(req.user.id, createSavingsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('savings/:id')
  updateSavings(@Request() req, @Param('id') id: number, @Body() updateSavingsDto: UpdateSavingsDto) {
    return this.savingsService.update(req.user.id, id, updateSavingsDto);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteSavings(@Request() req, @Param('id') id: number) {
    return this.savingsService.remove(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.savingsService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.savingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('year/:year')
  findByYear(@Request() req, @Param('year') year: number) {
    return this.savingsService.findByUserAndYear(req.user.id, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get('month/:month/year/:year')
  findByMonthAndYear(
    @Request() req,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.savingsService.findByUserAndMonthAndYear(
      req.user.id,
      month,
      year,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('total')
  findTotal(@Request() req) {
    return this.savingsService.findTotalByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('total/month/:month')
  findTotalByMonth(@Request() req, @Param('month') month: string) {
    return this.savingsService.findTotalByUserAndMonth(req.user.id, month);
  }

  @UseGuards(JwtAuthGuard)
  @Get('total/year/:year')
  findTotalByYear(@Request() req, @Param('year') year: string) {
    return this.savingsService.findTotalByUserAndYear(req.user.id, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get('total/month/:month/year/:year')
  findTotalByMonthAndYear(
    @Request() req,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.savingsService.findTotalByUserAndMonthAndYear(
      req.user.id,
      month,
      year,
    );
  }
}
