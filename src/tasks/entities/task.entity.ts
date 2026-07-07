import { Goal } from 'src/goals/entities/goal.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date; // Дата и время для кастомного календаря

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Goal, (goal) => goal.tasks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  goal: Goal;

  @CreateDateColumn()
  createdAt: Date;
}
