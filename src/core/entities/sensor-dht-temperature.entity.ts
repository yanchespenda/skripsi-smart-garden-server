import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class SensorDHTTemperature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'float',
    width: 2,
    precision: 2
  })
  temperature: number;

  @ManyToOne(() => User, user => user.id)
  user: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}