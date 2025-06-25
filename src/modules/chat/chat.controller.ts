import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './DTOs/message.dto';
import { ContractDto } from './DTOs/contract.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../users/entities/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('start')
  getConversation(@Body() userID: string, @Body() otherUserID: string) {
    console.log('userID', userID, 'otherUserID', otherUserID);
    // @Query('user1', ParseUUIDPipe) user1: string,
    // @Query('user2', ParseUUIDPipe) user2: string,
    return this.chatService.getConversation(userID, otherUserID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('contract')
  getContract(
    @Query('worker', ParseUUIDPipe) worker: string,
    @Query('client', ParseUUIDPipe) client: string,
  ) {
    return this.chatService.getContract(worker, client);
  }

  @UseGuards(JwtAuthGuard)
  @Post('messages')
  sendMessage(@Body() message: Message) {
    return this.chatService.sendMessage(message);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.worker)
  @Post('contract')
  createContract(@Body() contract: ContractDto) {
    return this.chatService.createContract(contract);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  @Put('contract/:id/accept')
  acceptContract(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.acceptContract(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  @Put('contract/:id/reject')
  rejectContract(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.rejectContract(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  @Put('contract/:id/completed')
  endContract(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.endContract(id);
  }
}
