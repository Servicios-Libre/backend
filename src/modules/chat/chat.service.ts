import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { ContractDto } from './DTOs/contract.dto';
import { StatusContract } from './entities/statusContract.enum';
import { Message } from './entities/message.entity';
import { MessageDto } from './DTOs/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Contract)
    private ContractRepository: Repository<Contract>,
  ) {}
  async getConversation(user1: string, user2: string) {
    try {
      const chat = await this.chatRepository.findOneOrFail({
        where: [
          { user1, user2 },
          { user1: user2, user2: user1 },
        ],
      });
      return { chatId: chat.id };
    } catch {
      const chat = await this.chatRepository.save({
        user1,
        user2,
      });
      const id = chat.id;
      return { chatId: id };
    }
  }
  async getMessages(id: string) {
    return await this.messageRepository.find({
      where: { chat: { id } },
    });
  }

  async sendMessage(message: MessageDto, chatId: string) {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    message.chat = chat;
    console.log(message);
    const newMessage = await this.messageRepository.save(message);
    return await this.messageRepository.findOne({
      where: { id: newMessage.id },
      relations: { chat: true },
    });
  }

  async getContract(worker: string, client: string) {
    try {
      return await this.ContractRepository.findOne({
        where: { workerId: worker, clientId: client },
      });
    } catch {
      throw new BadRequestException('Contract not found');
    }
  }

  async createContract(contract: ContractDto) {
    const status = StatusContract.pending;
    const startDate = new Date();
    const contractToSave = { ...contract, status, startDate };
    return await this.ContractRepository.save(contractToSave);
  }

  async acceptContract(id: string) {
    try {
      await this.ContractRepository.update(id, {
        status: StatusContract.accepted,
      });
      return 'Contract accepted successfully';
    } catch {
      throw new BadRequestException('Contract not exist');
    }
  }

  async rejectContract(id: string) {
    try {
      await this.ContractRepository.update(id, {
        status: StatusContract.rejected,
      });
      return 'Contract rejected successfully';
    } catch {
      throw new BadRequestException('Contract not exist');
    }
  }

  async endContract(id: string) {
    try {
      await this.ContractRepository.update(id, {
        endDate: new Date(),
      });
      return 'Contract ended successfully';
    } catch {
      throw new BadRequestException('Contract not exist');
    }
  }

  async getInbox(id: string) {
    const chats = await this.chatRepository.find({
      where: [{ user1: id }, { user2: id }],
    });
    if (!chats || chats.length === 0)
      throw new BadRequestException('No chats found');
    return chats;
  }
}
