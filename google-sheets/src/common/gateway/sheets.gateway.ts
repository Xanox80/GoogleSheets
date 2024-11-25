import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class SheetsGateway {
  @WebSocketServer() server: Server;

  sendNotification(message: string): void {
    this.server.emit('fileUpdate', message);
    console.log(`WebSocket message sent: ${message}`);
  }
}
