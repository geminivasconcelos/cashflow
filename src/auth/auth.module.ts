import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetCode } from './reset-code.entity';
import { User } from 'src/user/user.entity';
import { PasswordRecoveryService } from './password-recovery.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRETKEY'),
        signOptions: {
          expiresIn: configService.get<string>('EXPIRESIN'),
        },
      }),
    }),
    UserModule,
    TypeOrmModule.forFeature([ResetCode])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PasswordRecoveryService],
  exports: [PassportModule, JwtModule, PasswordRecoveryService],
})
export class AuthModule {}
