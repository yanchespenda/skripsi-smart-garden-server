import { SIGNUP_TOKEN } from '@base/core/constants';
import { ActionMessage } from '@base/universal-interface';
import { comparePasswords } from '@base/utils';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordUserDto } from '../user/dto/password.dto';
import { CreateUserDto } from '../user/dto/user.create.dto';
import { UserDto } from '../user/dto/user.dto';
import { LoginUserDto } from '../user/dto/user.login.dto';
import { UserService } from '../user/user.service';
import { LoginStatus } from './interfaces/login.status.interface';
import { McuToken } from './interfaces/mcu.token.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration.status.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      statusCode: 200,
      message: 'User registered',
    };

    const areEqual = await comparePasswords(SIGNUP_TOKEN, userDto.token);
    if (!areEqual) {
      status = {
        statusCode: 422,
        message: 'Token not valid',
      };
    } else {
      try {
        await this.usersService.create(userDto);
      } catch (err) {
        status = {
          statusCode: 422,
          message: err.response,
        };
      }
    }

    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.usersService.findByLogin(loginUserDto);

    const token = this._createToken(user);

    return {
      username: user.username,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

  async getMcuToken(userDto: UserDto): Promise<McuToken> {
    if (userDto?.mcuToken) {
      return {
        token: userDto.mcuToken
      }
    } else {
      return {
        token: null
      }
    }
  }

  async createMcuToken(userDto: UserDto): Promise<McuToken> {
    try {
      const updateToken = await this.usersService.createMcuToken(userDto);
      return {
        token: updateToken.mcuToken
      }
    } catch (error) {
      throw new BadRequestException(error.message ? error.message : 'Something went wrong');
    }
  }

  async changePassword(userDto: UserDto, passwordUserDto: PasswordUserDto): Promise<ActionMessage> {
    if (passwordUserDto.passwordConfirm !== passwordUserDto.passwordNew) {
      throw new BadRequestException('Password does not match');
    }

    try {
      return await this.usersService.changePassword(userDto, passwordUserDto);
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  private _createToken({ username }: UserDto): any {
    const expiresIn = process.env.EXPIRESIN;

    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn,
      accessToken,
    };
  }
}
