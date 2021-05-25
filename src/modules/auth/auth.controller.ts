import { ActionMessage } from '@base/universal-interface';
import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PasswordUserDto } from '../user/dto/password.dto';
import { CreateUserDto } from '../user/dto/user.create.dto';
import { LoginUserDto } from '../user/dto/user.login.dto';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login.status.interface';
import { McuToken } from './interfaces/mcu.token.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration.status.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto
    );

    if (result.statusCode !== 200) {
      throw new BadRequestException(result.message);
    }

    return result;
  }

  @Post('signin')
  public async signin(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return await this.authService.login(loginUserDto);
  } // ChangePassword

  @Post('change-password')
  @UseGuards(AuthGuard())
  public async changePassword(@Req() req: any, @Body() passwordUserDto: PasswordUserDto): Promise<ActionMessage> {
    return await this.authService.changePassword(req.user, passwordUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuard())
  public async me(@Req() req: any): Promise<any> {
    return {
      user: req.user,
      pumpAction: req.user.pumpAction,
      message: 'OK'
    };
  }

  @Get('mcu-token')
  @UseGuards(AuthGuard())
  public async getMcuToken(@Req() req: any): Promise<McuToken> {
    return await this.authService.getMcuToken(req.user);
  }

  @Post('mcu-token')
  @UseGuards(AuthGuard())
  public async createMcuToken(@Req() req: any): Promise<McuToken> {
    return await this.authService.createMcuToken(req.user);
  }
}
