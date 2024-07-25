import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from '../conversation/conversation.service';
import { SocketEvent } from './dto/socket-event';
import { SendMessageDto } from './dto/send-message.dto';
import { AIService } from '../ai-chatbot/ai.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly aiService: AIService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket): Promise<any> {
    const participantId = socket.handshake.query.participantId as string;
    const conversations =
      await this.conversationService.getParticipantConversation(participantId);

    const conversationIdsString = conversations.map((conversation) =>
      conversation.id.toString(),
    );
    socket.join(conversationIdsString);
    return null;
  }

  handleDisconnect(socket: Socket): any {
    const token = socket.handshake.headers.authorization;

    return null;
  }

  @SubscribeMessage(SocketEvent.MESSAGE_SENT)
  async message(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dto: SendMessageDto,
  ): Promise<void> {
    const participantId = socket.handshake.query.participantId as string;

    const conversation = await this.conversationService.getConversationById(
      dto.runId,
    );

    await this.conversationService.userSendMessage(
      dto.runId,
      dto.message,
      participantId,
    );
  }

  async sendMessageToClient(
    conversationId: string,
    message: string,
  ): Promise<void> {
    this.server.to(conversationId).emit(SocketEvent.MESSAGE_RECEIVED, {
      message,
    });
  }
}
