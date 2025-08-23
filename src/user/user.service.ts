// import { HttpException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { User } from './user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { UpdatePasswordDto } from './dto/update-password.dto';

// @Injectable()
// export class UserService {
//   private readonly logger = new Logger(UserService.name);

//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async createUsers(user: CreateUserDto) {
//     try {
//       const hashedPassword = await hash(user.password, 10);
//       const newUser = this.userRepository.create({
//         ...user,
//         password: hashedPassword,
//       });
//       return await this.userRepository.save(newUser);
//     } catch (error) {
//       throw new HttpException(
//         'Erro ao criar usuário: ' + error.message,
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }

//   async getUsersById(id: number) {
//     const user = await this.userRepository.findOne({ where: { id } });

//     if (!user) {
//       throw new NotFoundException(`Usuário com id ${id} não encontrado`);
//     }

//     return user;
//   }

//   getAllUserss() {
//     return this.userRepository.find();
//   }

//   async updateUsers(
//     id: string,
//     user: UpdateUserDto,
//   ): Promise<{ message: string }> {
//     try {
//       const { ...updateData } = user;

//       const result = await this.userRepository.update(id, updateData);

//       if (!result.affected) {
//         throw new NotFoundException(`Usuário com ID "${id}" não encontrado`);
//       }

//       return { message: 'Usuário atualizado com sucesso' };
//     } catch (error) {
//       throw new HttpException(
//         `Erro ao atualizar usuário: ${error.message || error}`,
//         HttpStatus.BAD_REQUEST,
//       );
//     }
//   }

//   async deleteUser(id: string): Promise<{ message: string }> {
//     const result = await this.userRepository.delete(id);

//     if (!result.affected) {
//       throw new NotFoundException(`Usuário com ID "${id}" não encontrado`);
//     }

//     return { message: 'Usuário deletado com sucesso' };
//   }

//   async findByLogin({ email, password }: LoginUsersDto): Promise<FormatLogin> {
//     const user = await this.userRepository.findOne({ where: { email } });
//     if (!user) {
//       throw new UnauthorizedException('Usuário não encontrado');
//     }

//     const match = await compare(password, user.password);
//     if (!match) {
//       throw new UnauthorizedException('Senha incorreta');
//     }

//     const { password: _, ...result } = user;
//     return result;
//   }

//   async findByPayload({ email }: any): Promise<any> {
//     return await this.userRepository.findOne({ where: { email } });
//   }

//   async updatePassword(payload: UpdatePasswordDto, id: number): Promise<User> {
//     const user = await this.userRepository.findOne({ where: { id } });

//     if (!user) {
//       throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
//     }

//     const areEqual = await compare(payload.old_password, user.password);

//     if (!areEqual) {
//       throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
//     }

//     user.password = await hash(payload.new_password, 10);
//     return this.userRepository.save(user);
//   }
// }

import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Função para gerar MD5
  private md5Hash(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  async createUsers(user: CreateUserDto) {
    try {
      const hashedPassword = this.md5Hash(user.password);
      const newUser = this.userRepository.create({
        ...user,
        password: hashedPassword,
      });
      return await this.userRepository.save(newUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          'Erro ao criar usuário: ' + error.message,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Erro desconhecido ao criar usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUsersById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    }

    return user;
  }

  getAllUserss() {
    return this.userRepository.find();
  }

  async updateUsers(
    id: string,
    user: UpdateUserDto,
  ): Promise<{ message: string }> {
    try {
      const result = await this.userRepository.update(id, user);

      if (!result.affected) {
        throw new NotFoundException(`Usuário com ID "${id}" não encontrado`);
      }

      return { message: 'Usuário atualizado com sucesso' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          `Erro ao atualizar usuário: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Erro desconhecido ao atualizar usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Usuário com ID "${id}" não encontrado`);
    }

    return { message: 'Usuário deletado com sucesso' };
  }

  async findByLogin({
    email,
    password,
  }: LoginUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    
    const match = user.password === this.md5Hash(password);
    if (!match) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async findByPayload({ email }: { email: string }): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updatePassword(payload: UpdatePasswordDto, id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = user.password === this.md5Hash(payload.old_password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    user.password = this.md5Hash(payload.new_password);
    return this.userRepository.save(user);
  }
}
