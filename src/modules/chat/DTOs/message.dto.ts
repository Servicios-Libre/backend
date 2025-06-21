import { IsEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class Message {
  @IsNotEmpty()
  @IsUUID()
  senderId: string;

  @IsNotEmpty()
  @IsUUID()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsEmpty()
  timestamp?: Date;
}
