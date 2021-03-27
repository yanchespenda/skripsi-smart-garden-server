import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SensorWaterLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'float',
  })
  level: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}