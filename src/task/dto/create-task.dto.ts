export class CreateTaskDto {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: Date;
  readonly priority: string;
  readonly status: string;
}
