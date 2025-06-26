import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './entities/message.entity';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('mensaje')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Mensaje recibido: ${message}`);
    client.emit('respuesta', `Servidor recibió: ${message}`);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const room = `chat_${chatId}`;
    await client.join(room);
    console.log(`Socket ${client.id} unido a sala ${room}`);
    client.emit('joinedChat', chatId);
  }

  emitNewMessage(message: Message) {
    const chatRoom = `chat_${message.chat.id}`;
    console.log('Emitiendo newMessage a sala:', chatRoom);
    this.server.to(chatRoom).emit('newMessage', {
      id: message.id,
      content: message.message,
      chatId: message.chat.id,
      sender: message.senderId,
      createdAt: message.timestamp,
    });
  }
}
