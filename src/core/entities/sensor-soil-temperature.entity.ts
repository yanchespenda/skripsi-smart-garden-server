import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class SensorSoilTemperature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'float',
    width: 2,
    precision: 2
  })
  temperature: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}