import { Goal } from 'src/goals/entities/goal.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('life_areas')
export class LifeArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Например: Спорт, Карьера, Хобби

  @Column({ nullable: true })
  color: string; // HEX-код для кастомного календаря и UI

  @ManyToOne(() => User, (user) => user.lifeAreas, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Goal, (goal) => goal.lifeArea)
  goals: Goal[];
}
