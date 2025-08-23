
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { VariableExpensesService } from './variable-expenses.service';
import { CreateVariableExpensesDto } from './dto/create-variable-expenses.dto';
import { UpdateVariableExpensesDto } from './dto/update-variable-expenses.dto';

@Controller()
export class VariableExpenseController {
      constructor(private readonly variableExpensesService: VariableExpensesService) {}
    
      @Post()
      create(@Body() createVariableExpensesDto: CreateVariableExpensesDto) {
        return this.variableExpensesService.create(createVariableExpensesDto);
      }
    
      @Patch(':id')
      update(
        @Param('id') id: number,
        @Body() updateVariableExpensesDto: UpdateVariableExpensesDto,
      ) {
        return this.variableExpensesService.update(id, updateVariableExpensesDto);
      }
    
      @Delete(':id')
      remove(@Param('id') id: number) {
        return this.variableExpensesService.remove(id);
      }
    
      @Get(':id')
      findOne(@Param('id') id: number) {
        return this.variableExpensesService.findOne(id);
      }
    
      @Get()
      findAll() {
        return this.variableExpensesService.findAll();
      }
    
      @Get('user/:userId')
      findByUser(@Param('userId') userId: number) {
        return this.variableExpensesService.findByUser(userId);
      }
    
      @Get('user/:userId/month/:month/year/:year')
      findByUserAndMonthAndYear(
        @Param('userId') userId: number,
        @Param('month') month: string,
        @Param('year') year: string,
      ) {
        return this.variableExpensesService.findByUserAndMonthAndYear(
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
        return this.variableExpensesService.findByUserAndMonthAndYearAndCategory(
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
        return this.variableExpensesService.findByCategory(userId, category);
      }
    
      @Get('user/:userId/year/:year')
      findByUserAndYear(
        @Param('userId') userId: number,
        @Param('year') year: string,
      ) {
        return this.variableExpensesService.findByUserAndYear(userId, year);
      }
    
      @Get('user/:userId/month/:month')
      findByUserAndMonth(
        @Param('userId') userId: number,
        @Param('month') month: string,
      ) {
        return this.variableExpensesService.findByUserAndMonth(userId, month);
      }
}
