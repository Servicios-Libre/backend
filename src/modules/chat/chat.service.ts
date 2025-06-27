import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { ContractDto } from './DTOs/contract.dto';
import { StatusContract } from './entities/statusContract.enum';
import { Message } from './entities/message.entity';
import { MessageDto } from './DTOs/message.dto';
import { User } from '../users/entities/users.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Contract)
    private ContractRepository: Repository<Contract>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async getConversation(userId: string, otherUserId: string) {
    try {
      const chat = await this.chatRepository.findOneOrFail({
        where: [{ user: userId, otherUser: otherUserId }],
      });
      return { chatId: chat.id };
    } catch {
      const chat = await this.chatRepository.save({
        user: userId,
        otherUser: otherUserId,
      });
      const id = chat.id;
      return { chatId: id };
    }
  }

  async getMessages(id: string) {
    const messages = await this.messageRepository.find({
      where: { chat: { id } },
    });
    const chat = await this.chatRepository.findOneBy({ id });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }
    const user1 = await this.userRepository.findOneBy({ id: chat.user });
    const user2 = await this.userRepository.findOneBy({ id: chat.otherUser });
    return { messages, user1, user2 };
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
      where: [{ user: { id } }, { otherUser: { id } }],
      relations: ['user', 'otherUser'],
    });
    if (!chats || chats.length === 0)
      throw new BadRequestException('No chats found');
    return chats;
  }
}
