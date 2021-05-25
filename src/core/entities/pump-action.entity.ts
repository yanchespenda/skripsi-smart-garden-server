import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PumpAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'date',
    nullable: true
  })
  lastAction: Date;

  @Column({
    type: 'boolean',
    default: false
  })
  automationEnable: boolean;

  @Column({
    type: 'text',
    nullable: true
  })
  automationParameter: string;

  @Column({
    type: 'boolean',
    default: false
  })
  routineTaskEnable: boolean;

  @Column({
    type: 'text',
    nullable: true
  })
  routineTaskTime: string;

  @Column({
    type: 'boolean',
    default: false
  })
  routineTaskSkipIfExceedParameter: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}