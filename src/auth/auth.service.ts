import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const { email, password } = authDto;

    const candidate = await this.userRepository.findOne({ where: { email } });
    if (candidate) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      passwordHash,
    });

    await this.userRepository.save(user);
    return this.generateToken(user);
  }

  async login(authDto: AuthDto) {
    const { email, password } = authDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return this.generateToken(user);
    }

    throw new UnauthorizedException('Неверный email или пароль');
  }

  private generateToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
