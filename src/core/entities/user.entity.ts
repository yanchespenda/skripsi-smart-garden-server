import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SensorDHTHumidity } from './sensor-dht-humidity.entity';
import { SensorDHTTemperature } from './sensor-dht-temperature.entity';
import { SensorSoilMoisture } from './sensor-soil-moisture.entity';
import { SensorSoilTemperature } from './sensor-soil-temperature.entity';

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
    nullable: true,
  })
  mcuToken: string;

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);  
  } 
}