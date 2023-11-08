export class CreateNotificationDto {
  readonly message: string;
  readonly dateTime: Date;
  readonly recipientId: number;
}
