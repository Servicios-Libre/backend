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
import { ContractDto } from './DTOs/contract.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../users/entities/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChatGateway } from './chat.gateway';
import { MessageDto } from './DTOs/message.dto';

@ApiBearerAuth()
@Controller('api/chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('start')
  getConversation(
    @Body() { userId, otherUserId }: { userId: string; otherUserId: string },
  ) {
    return this.chatService.getConversation(userId, otherUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  getMessages(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.getMessages(id);
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
  @Post(':id/messages')
  async sendMessage(
    @Body() message: MessageDto,
    @Param('id', ParseUUIDPipe) chatId: string,
  ) {
    const newMessage = await this.chatService.sendMessage(message, chatId);
    this.chatGateway.emitNewMessage(newMessage);
    return newMessage;
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
