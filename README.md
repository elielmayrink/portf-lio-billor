# Portfólio Billor - Backend Monolítico

Projeto de portfólio alinhado à vaga de Engenheiro de Software Backend (Billor). Foco em NestJS, PostgreSQL e WebSockets (tempo real) com boas práticas de arquitetura, segurança e DX.

## Visão Geral

- API monolítica em NestJS + TypeScript
- REST + Swagger
- WebSocket (Socket.IO) para rastreamento em tempo real
- PostgreSQL como banco principal
- Docker Compose para ambiente de desenvolvimento

## Estrutura

- `backend/`: código da API NestJS
- `docker-compose.yml`: orquestra Postgres, Adminer e API

## Requisitos

- Node.js 20+
- Docker e Docker Compose (opcional, recomendado)

## Como rodar (com Docker - recomendado)

1. Build e subir serviços:
   - `docker compose up -d --build`
2. Endpoints úteis:
   - API Health: `http://localhost:3000/api/v1/health`
   - Swagger: `http://localhost:3000/api/docs`
   - Adminer (DB UI): `http://localhost:8080` (System: PostgreSQL, Server: db, User: postgres, Password: postgres, Database: billor)
3. Logs:
   - `docker compose logs -f api`
4. Parar:
   - `docker compose down` (mantém dados)
   - `docker compose down -v` (remove volume do Postgres)

## Como rodar (sem Docker)

1. Instalar dependências:
   - `cd backend && npm install`
2. Rodar em dev:
   - `npm run start:dev`
3. Health/Docs:
   - Health: `http://localhost:3000/api/v1/health`
   - Swagger: `http://localhost:3000/api/docs`

Observação: a conexão com banco será configurada quando o ORM for adicionado (TypeORM). Até lá, a API sobe sem acessar o Postgres.

## Scripts úteis (backend)

- `npm run dev`: alias para `start:dev`
- `npm run start`: inicia em modo normal
- `npm run build`: build para `dist/`
- `npm run lint`: ESLint
- `npm run test`: testes (unit)

## Roadmap (curto prazo)

- Config/DB: `ConfigModule` + validação env + TypeORM + migrations
- Auth: JWT + RBAC
- Domínio: CRUDs Drivers/Trucks/Freights
- Realtime: Gateway de tracking e simulador

## Licença

Uso de portfólio/estudo.
