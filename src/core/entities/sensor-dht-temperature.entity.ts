import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}