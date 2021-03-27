import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SensorSoilMoisture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'float',
    width: 2,
    precision: 2
  })
  moisture: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}