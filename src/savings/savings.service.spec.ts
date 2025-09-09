import { Test, TestingModule } from '@nestjs/testing';
import { SavingsService } from './savings.service';
import { Savings } from './savings.entity';
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
  createQueryBuilder: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
  })),
});

import { ObjectLiteral } from 'typeorm';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('SavingsService', () => {
  let service: SavingsService;
  let repository: MockRepository<Savings>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SavingsService,
        {
          provide: getRepositoryToken(Savings),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SavingsService>(SavingsService);
    repository = module.get<MockRepository<Savings>>(
      getRepositoryToken(Savings),
    );
  });

  describe('create', () => {
    it('deve criar uma nova savings entry com sucesso', async () => {
      const dto = { amount: 100, description: 'Test' } as any;
      const createdEntity = { id: 1, ...dto, userId: 1 };

      repository.create!.mockReturnValue(createdEntity);
      repository.save?.mockResolvedValue(createdEntity);

      const result = await service.create(1, dto);

      expect(repository.create).toHaveBeenCalledWith({ ...dto, userId: 1 });
      expect(repository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual({
        message: 'Savings entry created successfully',
        savingsEntry: createdEntity,
      });
    });

    it('deve lançar erro InternalServerErrorException ao falhar', async () => {
      repository.create?.mockImplementation(() => {
        throw new Error();
      });

      await expect(service.create(1, {} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar uma savings entry com sucesso', async () => {
      const existingEntry = { id: 1, userId: 1 };
      repository.findOne?.mockResolvedValue(existingEntry);
      repository.update?.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, 1, { amount: 200 } as any);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(repository.update).toHaveBeenCalledWith(1, { amount: 200 });
      expect(result).toEqual({ message: 'Savings entry updated successfully' });
    });

    it('deve lançar NotFoundException se a entry não existir', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.update(1, 999, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar InternalServerErrorException se houver outro erro', async () => {
      repository.findOne?.mockRejectedValue(new Error('DB error'));

      await expect(service.update(1, 1, {} as any)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover uma savings entry com sucesso', async () => {
      const existingEntry = { id: 1, userId: 1 };
      repository.findOne?.mockResolvedValue(existingEntry);
      repository.delete?.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1, 1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(repository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Savings entry removed successfully' });
    });

    it('deve lançar NotFoundException se a entry não existir', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar InternalServerErrorException se houver outro erro', async () => {
      repository.findOne?.mockRejectedValue(new Error('DB error'));

      await expect(service.remove(1, 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as savings entries', async () => {
      const entries = [{ id: 1 }, { id: 2 }];
      repository.find?.mockResolvedValue(entries);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Savings entries retrieved successfully',
        savingsEntries: entries,
      });
    });

    it('deve lançar erro se falhar no find', async () => {
      repository.find?.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll()).rejects.toThrow(Error);
    });
  });

  describe('findAllByUser', () => {
    it('deve retornar savings do usuário', async () => {
      const entries = [
        { id: 1, userId: 1 },
        { id: 2, userId: 1 },
      ];
      repository.find?.mockResolvedValue(entries);

      const result = await service.findAllByUser(1);

      expect(repository.find).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(result).toEqual({
        message: 'Savings entries retrieved successfully',
        savingsEntries: entries,
      });
    });

    it('deve lançar erro se find falhar', async () => {
      repository.find?.mockRejectedValue(new Error('DB error'));
      await expect(service.findAllByUser(1)).rejects.toThrow(Error);
    });
  });

  describe('findOneByUser', () => {
    it('deve retornar uma savings entry do usuário', async () => {
      const entry = { id: 1, userId: 1 };
      repository.findOne?.mockResolvedValue(entry);

      const result = await service.findOneByUser(1, 1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual({
        message: 'Savings entry retrieved successfully',
        savingsEntry: entry,
      });
    });

    it('deve lançar NotFoundException se não encontrar', async () => {
      repository.findOne?.mockResolvedValue(null);
      await expect(service.findOneByUser(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUserAndYear', () => {
    it('deve retornar savings por ano', async () => {
      const entries = [{ id: 1, userId: 1, referenceYear: 2025 }];
      repository.find?.mockResolvedValue(entries);

      const result = await service.findByUserAndYear(1, 2025);
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 1, referenceYear: 2025 },
      });
      expect(result).toEqual({
        message: 'Savings entries retrieved successfully',
        savingsEntries: entries,
      });
    });

    it('deve lançar erro se find falhar', async () => {
      repository.find?.mockRejectedValue(new Error('DB error'));
      await expect(service.findByUserAndYear(1, 2025)).rejects.toThrow(Error);
    });
  });

  describe('findByUserAndMonthAndYear', () => {
    it('deve retornar savings por mês e ano', async () => {
      const entries = [
        { id: 1, userId: 1, referenceMonth: '08', referenceYear: '2025' },
      ];
      repository.find?.mockResolvedValue(entries);

      const result = await service.findByUserAndMonthAndYear(1, '08', '2025');

      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 1, referenceMonth: '08', referenceYear: '2025' },
      });
      expect(result).toEqual({
        message: 'Savings entries retrieved successfully',
        savingsEntries: entries,
      });
    });

    it('deve lançar erro se find falhar', async () => {
      repository.find?.mockRejectedValue(new Error('DB error'));
      await expect(
        service.findByUserAndMonthAndYear(1, '08', '2025'),
      ).rejects.toThrow(Error);
    });
  });

  describe('findTotalByUser', () => {
    it('deve retornar o total de savings do usuário', async () => {
      repository.createQueryBuilder!.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: 1000 }),
      });

      const result = await service.findTotalByUser(1);

      expect(result).toEqual({
        message: 'Total savings retrieved successfully',
        total: 1000,
      });
    });

    it('deve lançar erro se getRawOne falhar', async () => {
      repository.createQueryBuilder!.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockRejectedValue(new Error('DB error')),
      });

      await expect(service.findTotalByUser(1)).rejects.toThrow(Error);
    });
  });

  describe('findTotalByUserAndMonth', () => {
  it('deve retornar o total de savings do usuário no mês', async () => {
    repository.createQueryBuilder!.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: 500 }),
    });

    const result = await service.findTotalByUserAndMonth(1, '08');
    expect(result).toEqual({
      message: 'Total savings retrieved successfully',
      total: 500,
    });
  });

  it('deve lançar erro se getRawOne falhar', async () => {
    repository.createQueryBuilder!.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockRejectedValue(new Error('DB error')),
    });

    await expect(service.findTotalByUserAndMonth(1, '08')).rejects.toThrow(Error);
  });
});

describe('findTotalByUserAndYear', () => {
  it('deve retornar o total de savings do usuário no ano', async () => {
    repository.createQueryBuilder!.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: 2000 }),
    });

    const result = await service.findTotalByUserAndYear(1, '2025');
    expect(result).toEqual({
      message: 'Total savings retrieved successfully',
      total: 2000,
    });
  });

  it('deve lançar erro se getRawOne falhar', async () => {
    repository.createQueryBuilder!.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockRejectedValue(new Error('DB error')),
    });

    await expect(service.findTotalByUserAndYear(1, '2025')).rejects.toThrow(Error);
  });
});

describe('findTotalByUserAndMonthAndYear', () => {
  it('deve retornar o total de savings do usuário no mês e ano', async () => {
    repository.createQueryBuilder!.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValue({ total: 300 }),
    });

    const result = await service.findTotalByUserAndMonthAndYear(1, '08', '2025');
    expect(result).toEqual({
      message: 'Total savings retrieved successfully',
      total: 300,
    });
  });

  it('deve lançar erro se getRawOne falhar', async () => {
    repository.createQueryBuilder!.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockRejectedValue(new Error('DB error')),
    });

    await expect(service.findTotalByUserAndMonthAndYear(1, '08', '2025')).rejects.toThrow(Error);
  });
});

  describe('Métodos extras e branches', () => {
    it('findAll deve retornar array vazio se não houver savings', async () => {
      repository.find?.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual({
        message: 'Savings entries retrieved successfully',
        savingsEntries: [],
      });
    });

    it('findAllByUser deve retornar array vazio se não houver savings', async () => {
      repository.find?.mockResolvedValue([]);
      const result = await service.findAllByUser(1);
      expect(result).toEqual({
        message: 'Savings entries retrieved successfully',
        savingsEntries: [],
      });
    });
  });
});
