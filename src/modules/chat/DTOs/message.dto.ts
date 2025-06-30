import {
  IsEmpty,
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { Chat } from '../entities/chat.entity';

export class MessageDto {
  @IsNotEmpty()
  @IsUUID()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsISO8601()
  timestamp: string;

  @IsEmpty()
  isRead?: boolean;

  @IsEmpty()
  chat?: Chat;
}
