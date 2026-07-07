export class CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string; // ISO дата для календаря
  goalId?: string;
}
