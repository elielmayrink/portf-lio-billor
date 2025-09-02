# O que são WebSockets?

## Conceito
WebSockets são um protocolo que permite **comunicação bidirecional em tempo real** entre cliente e servidor, sobre uma única conexão TCP. 
Diferente do HTTP, onde o cliente sempre inicia a requisição, no WebSocket o servidor também pode enviar mensagens **sem que o cliente peça**.

Isso é útil para:
- Chats em tempo real
- Notificações instantâneas
- Rastreamento de veículos
- Jogos multiplayer

---

## Como funciona
1. O cliente (navegador ou app) envia um pedido de **handshake** HTTP para o servidor.
2. O servidor aceita e "atualiza" a conexão para WebSocket.
3. A partir daí, cliente e servidor trocam mensagens em tempo real, sem precisar abrir novas conexões.

---

## Fluxo Simplificado
```
Cliente  →  Servidor: "Quero abrir conexão WebSocket"
Servidor →  Cliente: "Ok, conexão aberta"
Cliente  ↔  Servidor: mensagens bidirecionais em tempo real
```

---

## WebSockets no NestJS
O NestJS oferece suporte nativo a WebSockets.

### Instalação
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io
```

### Exemplo de Gateway
```ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class TrackingGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: any) {
    return { event: 'join', message: `Usuário entrou: ${data.user}` };
  }

  sendTruckLocation(truckId: string, location: any) {
    this.server.emit('truck-location', { truckId, location });
  }
}
```

### Como funciona aqui
- `@WebSocketGateway()` → transforma a classe em um gateway WebSocket.
- `@SubscribeMessage('join')` → responde a eventos do cliente.
- `this.server.emit(...)` → envia mensagens a todos os clientes conectados.

---

## Benefícios
- Comunicação em tempo real
- Redução de overhead em comparação a polling
- Ótimo para rastreamento de caminhões, exatamente o caso da Billor

---
