import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository, Not, IsNull, In } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { ContractDto } from './DTOs/contract.dto';
import { StatusContract } from './entities/statusContract.enum';
import { Message } from './entities/message.entity';
import { MessageDto } from './DTOs/message.dto';
import { User } from '../users/entities/users.entity';
import { ChatGateway } from './chat.gateway';
import { Role } from '../users/entities/roles.enum';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Contract)
    private ContractRepository: Repository<Contract>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private chatGateway: ChatGateway,
  ) {}

  async getConversation(userId: string, otherUserId: string) {
    try {
      const chat = await this.chatRepository.findOneOrFail({
        where: [{ user: { id: userId }, otherUser: { id: otherUserId } }],
      });
      return { chatId: chat.id };
    } catch {
      const user = await this.userRepository.findOneBy({ id: userId });
      const otherUser = await this.userRepository.findOneBy({
        id: otherUserId,
      });

      if (!user || !otherUser) {
        throw new BadRequestException('Users not found');
      }

      const chat = await this.chatRepository.save({ user, otherUser });
      return { chatId: chat.id };
    }
  }

  async getMessages(id: string) {
    const messages = await this.messageRepository.find({
      where: { chat: { id } },
    });

    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['user', 'otherUser'],
    });

    if (!chat) {
      throw new BadRequestException('Chat not found');
    }

    const user1 = await this.userRepository.findOneBy({ id: chat.user.id });
    const user2 = await this.userRepository.findOneBy({
      id: chat.otherUser.id,
    });

    return { messages, user1, user2 };
  }

  async sendMessage(message: MessageDto, chatId: string) {
    const chat = await this.chatRepository.findOne({ where: { id: chatId } });
    if (!chat) {
      throw new BadRequestException('Chat not found');
    }

    const messageToSave: Partial<Message> = {
      senderId: message.senderId,
      message: message.message,
      timestamp: new Date(message.timestamp),
      isRead: false,
      chat,
    };

    const newMessage = await this.messageRepository.save(messageToSave);

    const savedMessage = await this.messageRepository.findOne({
      where: { id: newMessage.id },
      relations: { chat: true },
    });

    this.chatGateway.emitNewMessage(savedMessage!);

    return savedMessage;
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
    const chat = await this.chatRepository.findOne({
      where: { id: contract.chatId },
    });
    if (!chat) throw new BadRequestException('Chat not found');

    // 🛡️ Bloquear si ya hay contrato activo o pendiente sin finalizar
    const existing = await this.ContractRepository.findOne({
      where: {
        workerId: contract.workerId,
        clientId: contract.clientId,
        endDate: IsNull(), // aún no finalizado
        status: In([StatusContract.pending, StatusContract.accepted]), // aún en curso
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Ya existe un contrato activo entre este cliente y trabajador',
      );
    }

    const status = StatusContract.pending;
    const startDate = new Date();

    const contractToSave = this.ContractRepository.create({
      ...contract,
      chat,
      chatId: contract.chatId,
      status,
      startDate,
    });

    const savedContract = await this.ContractRepository.save(contractToSave);

    this.chatGateway.server
      .to(`chat_${contract.chatId}`)
      .emit('newContract', savedContract);

    return savedContract;
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

  async getInbox(userId: string) {
    const chats = await this.chatRepository.find({
      where: [{ user: { id: userId } }, { otherUser: { id: userId } }],
      relations: ['user', 'otherUser', 'messages'],
    });

    if (!chats || chats.length === 0) {
      return { message: 'No hay chats activos en tu bandeja de entrada' };
    }

    const inbox = chats
      .map((chat) => {
        const messages = chat.messages || [];

        const lastMessage =
          messages.length > 0
            ? messages.reduce((latest, current) =>
                current.timestamp! > latest.timestamp! ? current : latest,
              )
            : null;

        if (!chat.user || !chat.otherUser) {
          return null;
        }

        const otherUser = chat.user.id === userId ? chat.otherUser : chat.user;

        return {
          id: chat.id,
          otherUserId: otherUser.id,
          otherUsername: otherUser.name,
          otherUserPic: otherUser.user_pic,
          otherUserPremium: otherUser.premium,
          lastMessage: lastMessage
            ? {
                message: lastMessage.message,
                timestamp: lastMessage.timestamp,
                isRead: lastMessage.isRead,
                senderId: lastMessage.senderId,
              }
            : null,
        };
      })
      .filter((chat) => chat !== null)
      .sort((a, b) => {
        const timeA = a.lastMessage ? a.lastMessage.timestamp!.getTime() : 0;
        const timeB = b.lastMessage ? b.lastMessage.timestamp!.getTime() : 0;
        return timeB - timeA;
      });

    return inbox;
  }

  async markMessagesAsRead(chatId: string, userId: string) {
    await this.messageRepository.update(
      {
        chat: { id: chatId },
        isRead: false,
        senderId: Not(userId),
      },
      { isRead: true },
    );
    return { message: 'Mensajes marcados como leídos' };
  }

  async confirmContractStep(id: string, role: Role) {
    const contract = await this.ContractRepository.findOne({ where: { id } });
    if (!contract) {
      throw new BadRequestException('Contract not found');
    }

    if (role === Role.user) {
      contract.clientConfirmed = true;
    } else if (role === Role.worker) {
      contract.workerConfirmed = true;
    } else {
      throw new BadRequestException('Invalid role');
    }

    if (contract.clientConfirmed && contract.workerConfirmed) {
      contract.completed = true;
      contract.endDate = new Date();
    }

    const saved = await this.ContractRepository.save(contract);

    this.chatGateway.server
      .to(`chat_${contract.chatId}`)
      .emit('contractUpdated', saved);

    return saved;
  }

  async acceptContract(id: string) {
    const contract = await this.ContractRepository.findOne({ where: { id } });
    if (!contract) throw new BadRequestException('Contract not found');

    contract.status = StatusContract.accepted;

    const saved = await this.ContractRepository.save(contract);

    this.chatGateway.server
      .to(`chat_${saved.chatId}`)
      .emit('contractUpdated', saved);

    return saved;
  }
}
