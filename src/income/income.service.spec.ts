import { Test, TestingModule } from '@nestjs/testing';
import { IncomeService } from './income.service';
import { Income } from './income.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
});

type MockRepository<T extends object = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('IncomeService', () => {
  let service: IncomeService;
  let repository: MockRepository<Income>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomeService,
        {
          provide: getRepositoryToken(Income),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IncomeService>(IncomeService);
    repository = module.get<MockRepository<Income>>(getRepositoryToken(Income));
  });

  describe('create', () => {
    it('deve criar um income com sucesso', async () => {
      const dto = { amount: 100, description: 'Test', userId: 1 } as any;
      const createdIncome = { id: 1, ...dto };

      repository.create!.mockReturnValue(createdIncome);
      repository.save!.mockResolvedValue(createdIncome);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(createdIncome);
      expect(result).toEqual({
        message: 'Income created successfully',
        income: createdIncome,
      });
    });

    it('deve lançar erro ao falhar a criação', async () => {
      repository.create?.mockReturnValue({});
      repository.save?.mockRejectedValue(new Error('DB error'));

      await expect(service.create({} as any)).rejects.toThrow(Error);
    });
  });

  describe('update', () => {
    it('deve atualizar um income com sucesso', async () => {
      const existingIncome = { id: 1, userId: 1 };
      repository.findOne!.mockResolvedValue(existingIncome);
      repository.update!.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, 1, { amount: 200 } as any);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(repository.update).toHaveBeenCalledWith(1, { amount: 200 });
      expect(result).toEqual({ message: 'Income updated successfully' });
    });

    it('deve lançar NotFoundException se o income não existir', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.update(1, 999, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar InternalServerErrorException se ocorrer outro erro', async () => {
      repository.findOne!.mockRejectedValue(new Error('DB error'));

      await expect(service.update(1, 1, {} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('deve deletar um income com sucesso', async () => {
      const existingIncome = { id: 1, userId: 1 };
      repository.findOne!.mockResolvedValue(existingIncome);
      repository.delete!.mockResolvedValue({ affected: 1 });

      const result = await service.delete(1, 1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Income deleted successfully' });
    });

    it('deve lançar NotFoundException se não existir', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.delete(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar InternalServerErrorException se houver outro erro', async () => {
      repository.findOne!.mockRejectedValue(new Error('DB error'));

      await expect(service.delete(1, 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os incomes', async () => {
      const incomes = [{ id: 1 }, { id: 2 }];
      repository.find!.mockResolvedValue(incomes);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Incomes retrieved successfully',
        incomes,
      });
    });

    it('deve lançar erro se find falhar', async () => {
      repository.find!.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll()).rejects.toThrow(Error);
    });
  });

  describe('findByUserAndMonthAndYear', () => {
    it('deve retornar incomes se encontrados', async () => {
      const results = [{ id: 1 }];
      repository.find!.mockResolvedValue(results);

      const result = await service.findByUserAndMonthAndYear(1, '01', '2025');
      expect(result).toEqual(results);
    });

    it('deve lançar InternalServerErrorException se não houver resultados', async () => {
      repository.find!.mockResolvedValue([]);
      await expect(
        service.findByUserAndMonthAndYear(1, '01', '2025'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findByUserAndMonthAndCategory', () => {
    it('deve retornar incomes se encontrados', async () => {
      const results = [{ id: 1 }];
      repository.find!.mockResolvedValue(results);

      const result = await service.findByUserAndMonthAndCategory(
        1,
        '01',
        'Salary',
      );
      expect(result).toEqual(results);
    });

    it('deve lançar NotFoundException se não houver resultados', async () => {
      repository.find!.mockResolvedValue([]);
      await expect(
        service.findByUserAndMonthAndCategory(1, '01', 'Salary'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByUser', () => {
    it('deve retornar incomes do usuário', async () => {
      const incomes = [{ id: 1, userId: 1 }];
      repository.find!.mockResolvedValue(incomes);

      const result = await service.findAllByUser(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result).toEqual({
        message: 'Incomes retrieved successfully',
        incomes,
      });
    });

    it('deve lançar erro se find falhar', async () => {
      repository.find!.mockRejectedValue(new Error('DB error'));
      await expect(service.findAllByUser(1)).rejects.toThrow(Error);
    });
  });

  describe('findOne', () => {
    it('deve retornar income pelo id', async () => {
      const income = { id: 1 };
      repository.findOne!.mockResolvedValue(income);

      const result = await service.findOne(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(income);
    });

    it('deve lançar NotFoundException se não encontrar', async () => {
      repository.findOne!.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('deve retornar incomes por userId', async () => {
      const incomes = [{ id: 1, userId: 1 }];
      repository.find!.mockResolvedValue(incomes);

      const result = await service.findByUser(1);
      expect(repository.find).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result).toEqual(incomes);
    });

    it('deve lançar erro se find falhar', async () => {
      repository.find!.mockRejectedValue(new Error('DB error'));
      await expect(service.findByUser(1)).rejects.toThrow(Error);
    });
  });

  describe('findByUserAndCategory', () => {
    it('deve retornar incomes por userId e categoria', async () => {
      const incomes = [{ id: 1, userId: 1, category: 'Salary' }];
      repository.find!.mockResolvedValue(incomes);

      const result = await service.findByUserAndCategory(1, 'Salary');
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 1, category: 'Salary' },
      });
      expect(result).toEqual(incomes);
    });

    it('deve lançar erro se find falhar', async () => {
      repository.find!.mockRejectedValue(new Error('DB error'));
      await expect(service.findByUserAndCategory(1, 'Salary')).rejects.toThrow(
        Error,
      );
    });
  });

  describe('findByUserAndMonth', () => {
    it('deve retornar incomes por userId e mês', async () => {
      const incomes = [{ id: 1, userId: 1, referenceMonth: '01' }];
      repository.find!.mockResolvedValue(incomes);

      const result = await service.findByUserAndMonth(1, '01');
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 1, referenceMonth: '01' },
      });
      expect(result).toEqual({
        message: 'Incomes retrieved successfully',
        incomes,
      });
    });

    it('deve lançar erro se find falhar', async () => {
      repository.find!.mockRejectedValue(new Error('DB error'));
      await expect(service.findByUserAndMonth(1, '01')).rejects.toThrow(Error);
    });
  });

  describe('findByUserAndYear', () => {
    it('deve retornar incomes por userId e ano', async () => {
      const incomes = [{ id: 1, userId: 1, referenceYear: '2025' }];
      repository.find!.mockResolvedValue(incomes);

      const result = await service.findByUserAndYear(1, '2025');
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 1, referenceYear: '2025' },
      });
      expect(result).toEqual({
        message: 'Incomes retrieved successfully',
        incomes,
      });
    });

    it('deve lançar erro se find falhar', async () => {
      repository.find!.mockRejectedValue(new Error('DB error'));
      await expect(service.findByUserAndYear(1, '2025')).rejects.toThrow(Error);
    });
  });
});
