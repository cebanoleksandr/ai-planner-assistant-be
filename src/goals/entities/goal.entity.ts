import { LifeArea } from 'src/life-areas/entities/life-area.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'active' }) // active, completed, paused
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  targetDate: Date; // Дедлайн для цели

  @ManyToOne(() => User, (user) => user.goals, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => LifeArea, (lifeArea) => lifeArea.goals, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  lifeArea: LifeArea;

  @OneToMany(() => Task, (task) => task.goal)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
