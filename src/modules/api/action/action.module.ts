import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';

@Module({
  providers: [ActionService],
  controllers: [ActionController]
})
export class ActionModule {}
