import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, OneToMany, OneToOne, JoinColumn, Index } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SensorDHTHumidity } from './sensor-dht-humidity.entity';
import { SensorDHTTemperature } from './sensor-dht-temperature.entity';
import { SensorSoilMoisture } from './sensor-soil-moisture.entity';
import { SensorSoilTemperature } from './sensor-soil-temperature.entity';
import { PumpAttemp } from './pump-attemp.entity';
import { PumpRoutine } from './pump-routine.entity';
// import { PumpAction } from './pump-action.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn({unsigned: true})
  id: number;

  @Column({
    type: 'varchar', 
    nullable: false, 
    unique: true 
  })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar', 
    nullable: true
  })
  @Index()
  mcuToken: string;

  // Pumping Action
  @Column({
    type: 'datetime',
    nullable: true
  })
  lastAction: string;

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
    type: 'integer',
    default: 3
  })
  automationAttemp: number;

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
  // End Pumping Action

  @Column({
    type: 'text',
    nullable: true
  })
  notificationData: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => SensorDHTHumidity, sensor => sensor.user)
  sensorDHTHumidity: Promise<SensorDHTHumidity[]>;

  @OneToMany(() => SensorDHTTemperature, sensor => sensor.user)
  sensorDHTTemperature: Promise<SensorDHTTemperature[]>;

  @OneToMany(() => SensorSoilMoisture, sensor => sensor.user)
  sensorSoilMoisture: Promise<SensorSoilMoisture[]>;

  @OneToMany(() => SensorSoilTemperature, sensor => sensor.user)
  sensorSoilTemperature: Promise<SensorSoilTemperature[]>;

  @OneToMany(() => PumpAttemp, pumpAttemp => pumpAttemp.user)
  pumpAttemp: Promise<PumpAttemp>;

  @OneToMany(() => PumpRoutine, pumpAttemp => pumpAttemp.user)
  pumpRoutine: Promise<PumpRoutine>;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);  
  } 
}