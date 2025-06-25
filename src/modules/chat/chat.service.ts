import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Message } from './DTOs/message.dto';
import { Contract } from './entities/contract.entity';
import { ContractDto } from './DTOs/contract.dto';
import { StatusContract } from './entities/statusContract.enum';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Contract)
    private ContractRepository: Repository<Contract>,
  ) {}
  async getConversation(user1: string, user2: string) {
    // try {
    //   return await this.chatRepository.findOne({
    //     where: [
    //       { senderId: user1, receiverId: user2 },
    //       // { senderId: user2, receiverId: user1 },
    //     ],
    //   });
    // } catch {
    // throw new BadRequestException('messages not found');
    try {
      console.log('entro al try');

      const chat = await this.chatRepository.save({
        senderId: user1,
        receiverId: user2,
        message: 'No messages found',
        timestamp: new Date(),
      });
      console.log('chat', chat);

      const id = chat.id;
      return { chatId: id };
    } catch {
      console.log('entro al catch');
      throw new BadRequestException('messages not found');
    }
  }
  async getMessages(id: string) {
    return await this.messageRepository.find({
      where: { chat: { id } },
    });
  }

  async sendMessage(message: Message) {
    const timestamp = new Date();
    const messageToSave = { timestamp, ...message };
    await this.chatRepository.save(messageToSave);
    return 'Message create successfully';
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
}
