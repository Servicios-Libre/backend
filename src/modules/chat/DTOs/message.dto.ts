import { IsEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MessageDto {
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
