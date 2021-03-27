import { Module } from '@nestjs/common';
import { RouterModule, Routes } from 'nest-router';
import { AuthModule } from '@modules/auth/auth.module';
import { SensorModule } from './modules/api/sensor/sensor.module';


export const routes: Routes = [
  {
    path: '/api',
    children: [
      {
        path: 'sensor',
        module: SensorModule,
      }
    ]
  },
  {
    path: '/oauth',
    module: AuthModule,
  },
];

@Module({
  imports: [RouterModule.forRoutes(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
