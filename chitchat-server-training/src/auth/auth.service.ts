/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import config from 'src/common/configs/config';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  public async verifyTokenAndUpdateStatus(
    socket_id: string,
    token: string,
    status: string,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.userModel.findOneAndUpdate(
        { _id: payload.sub },
        { socket_id, status },
      );

      if (!user) return false;
      return user;
    } catch {
      return false;
    }
  }

  public async register(registerAuthDto: RegisterAuthDto) {
    const user = await this.userModel.findOne({ email: registerAuthDto.email });

    if (user) throw new BadRequestException('User is exist');

    const saltOrRounds = config().security.bcryptSaltOrRound;
    const hash = await bcrypt.hash(registerAuthDto.password, saltOrRounds);

    registerAuthDto.password = hash;

    const registeredUser = new this.userModel(registerAuthDto);
    await registeredUser.save();

    const payload = {
      sub: registeredUser._id,
      username: registeredUser.username,
      email: registeredUser.email,
      role: registeredUser.role,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: config().security.expiresIn,
    });

    const { password, ...result } = registeredUser.toObject();

    return {
      status: 201,
      success: true,
      access_token,
      token_type: 'Bearer',
      data: { user: result },
    };
  }

  public async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userModel.findOne({ email: loginAuthDto.email });
    if (!user) throw new NotFoundException('User not found');

    const matched = await bcrypt.compare(loginAuthDto.password, user.password);

    if (!matched)
      return {
        status: 401,
        success: false,
        message: 'Password is not match',
      };

    const payload = {
      sub: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: config().security.expiresIn,
    });
    const { password, ...result } = user.toObject();

    return {
      status: 201,
      success: true,
      access_token,
      token_type: 'Bearer',
      data: { user: result },
    };
  }

  public async forgot(data: any): Promise<any> {}

  public async reset(data: any): Promise<any> {}
}
