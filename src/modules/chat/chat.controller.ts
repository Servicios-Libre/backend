import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './DTOs/message.dto';
import { ContractDto } from './DTOs/contract.dto';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  getConversation(
    @Query('user1', ParseUUIDPipe) user1: string,
    @Query('user2', ParseUUIDPipe) user2: string,
  ) {
    return this.chatService.getConversation(user1, user2);
  }

  @Get('contract')
  getContract(
    @Query('worker', ParseUUIDPipe) worker: string,
    @Query('client', ParseUUIDPipe) client: string,
  ) {
    return this.chatService.getContract(worker, client);
  }

  @Post('messages')
  sendMessage(@Body() message: Message) {
    return this.chatService.sendMessage(message);
  }

  @Post('contract')
  createContract(@Body() contract: ContractDto) {
    return this.chatService.createContract(contract);
  }

  @Put('contract/:id/accept')
  acceptContract(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.acceptContract(id);
  }

  @Put('contract/:id/reject')
  rejectContract(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.rejectContract(id);
  }

  @Put('contract/:id/completed')
  endContract(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.endContract(id);
  }
}
