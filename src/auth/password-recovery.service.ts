import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './../user/user.service';
import { MailService } from 'src/mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetCode } from './reset-code.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @InjectRepository(ResetCode)
    private readonly resetCodeRepository: Repository<ResetCode>,
  ) {}

  async sendRecoveryCode(email: string) {
    const user = await this.userService.findOneEmail(email);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 10 * 60 * 1000);

    await this.resetCodeRepository.save({
      userId: user.id,
      email,
      code,
      expiresAt: expiration,
      used: false,
    });

    await this.mailService.sendMail({
      to: email,
      subject: 'Código de recuperação de senha',
      text: `Seu código de recuperação é: ${code}`,
    });

    return { message: 'Código enviado para o e-mail informado' };
  }

  async validateCode(code: string) {
    const resetCode = await this.resetCodeRepository.findOne({
      where: { code, used: false },
      relations: ['user'],
    });

    if (!resetCode) throw new BadRequestException('Código inválido');
    if (resetCode.expiresAt < new Date())
      throw new BadRequestException('Código expirado');

    const token = this.jwtService.sign(
      { userId: resetCode.userId },
      { expiresIn: '15m' },
    );

    return { message: 'Código válido', token };
  }

  async resetPassword(token: string, newPassword: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const result = await this.userService.updatePasswordById(
      payload.userId,
      newPassword,
    );
    const userId = result.user ? result.user.id : payload.userId;

    await this.resetCodeRepository.update({ userId }, { used: true });
    await this.resetCodeRepository.delete({ userId });

    await this.mailService.sendMail({
      to: result.user.email,
      subject: 'Senha redefinida com sucesso',
      text: `Sua senha foi redefinida com sucesso.`,
    });

    return { message: 'Senha redefinida com sucesso' };
  }
}
