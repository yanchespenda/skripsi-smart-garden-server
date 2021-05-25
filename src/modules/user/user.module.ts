import { PumpAction } from '@base/core/entities/pump-action.entity';
import { PumpAttemp } from '@base/core/entities/pump-attemp.entity';
import { User } from '@base/core/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PumpAction,
      PumpAttemp
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
