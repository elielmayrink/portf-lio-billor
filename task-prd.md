# PRD - Backend Monolítico (Portfólio Billor)

## 1. Visão Geral

- **Problema**: Demonstrar domínio em NestJS, PostgreSQL e WebSockets para a vaga Backend, com um MVP de gestão de fretes (auth + CRUD + rastreamento em tempo real).
- **Objetivo do MVP**: Usuários autenticados gerenciam Motoristas/Caminhões/Fretes e acompanham posições simuladas de fretes ativos em tempo real.
- **Métricas de sucesso**: p95 < 200ms em CRUDs sob 50 rps local; 70%+ cobertura unitária; e2e cobrindo auth, CRUDs e tracking.

## 2. Personas

- **Administrador (Admin)**: Mantém cadastros e opera fretes.
- **Motorista (Driver)**: Acompanha seus fretes e recebe/gera atualizações de localização.

## 3. Escopo

### 3.1 Incluído

- JWT + RBAC (admin/driver), CRUDs Drivers/Trucks/Freights, WebSocket com Socket.IO e dados simulados, Swagger, logs e healthcheck, docker-compose dev.

### 3.2 Excluído (por agora)

- Pagamentos reais, Redis cluster, multi-instância, deploy cloud, auditoria completa.

## 4. User Stories (com critérios de aceite)

- Admin faz login para acessar recursos protegidos.
  - Aceite: POST /auth/login (200) retorna token válido 15m; 401 senão.
- Admin gerencia Motoristas e Caminhões via CRUD.
  - Aceite: Conflitos de unicidade (email/placa) retornam 409; validações 400.
- Admin cria Fretes vinculados a Motorista e Caminhão.
  - Aceite: Recusa ids inexistentes; status inicial "created".
- Driver vê seus próprios Fretes.
  - Aceite: GET lista apenas fretes do usuário logado com role driver.
- Driver/Admin acompanham localização em tempo real de um Frete.
  - Aceite: Ao entrar na sala `freight:{id}` autenticado, recebe `location.update` ~2s.

## 5. Requisitos Funcionais

- RF1: Autenticação JWT (access; refresh opcional).
- RF2: RBAC com `admin` e `driver` (guards/decorators).
- RF3: CRUDs de `drivers`, `trucks`, `freights` com paginação/ordenção.
- RF4: Swagger/OpenAPI e validação com DTOs.
- RF5: WebSocket de rastreamento com salas `driver:{id}` e `freight:{id}`.

## 6. Requisitos Não Funcionais

- RNF1: p95 < 200ms nos CRUDs sob 50 rps local.
- RNF2: Logs estruturados com `requestId`; healthcheck `/health`.
- RNF3: Segurança: CORS, Helmet, rate limit em `/auth/login`.
- RNF4: Código TS com ESLint/Prettier; cobertura unit >= 70%.

## 7. Modelo de Dados (alto nível)

- `users`: id, email (unique), password_hash, role, created_at
- `drivers`: id, user_id (unique), name, license, status, created_at
- `trucks`: id, plate (unique), model, year, driver_id (nullable), created_at
- `freights`: id, driver_id, truck_id, origin, destination, status, price, created_at
- Índices: `users(email)`, `trucks(plate)`, `freights(status, driver_id)` composto.

## 8. Contratos de API (v1)

### 8.1 Auth

- POST `/api/v1/auth/login`
  - body: { email, password }
  - 200: { accessToken, expiresIn }
  - 401: credenciais inválidas

### 8.2 Drivers

- GET `/api/v1/drivers?limit&offset&order`
- POST `/api/v1/drivers` { name, license, userId }
- PATCH `/api/v1/drivers/:id`
- DELETE `/api/v1/drivers/:id`

### 8.3 Trucks

- GET `/api/v1/trucks?limit&offset&order`
- POST `/api/v1/trucks` { plate, model, year, driverId? }
- PATCH `/api/v1/trucks/:id`
- DELETE `/api/v1/trucks/:id`

### 8.4 Freights

- GET `/api/v1/freights?status&driverId&limit&offset&order`
- POST `/api/v1/freights` { driverId, truckId, origin, destination, price }
- PATCH `/api/v1/freights/:id` { status? }
- DELETE `/api/v1/freights/:id`

Notas comuns:

- Paginação: `limit` (default 20, max 100), `offset`.
- Ordenação: `order=field:asc|desc` (whitelist).
- Erros: 400 validação, 401 auth, 403 autorização, 404 não encontrado, 409 conflito.

## 9. Contratos WebSocket (Socket.IO)

- Path: `/tracking`
- Autenticação: JWT no handshake (`Authorization: Bearer <token>`)
- Salas: `driver:{driverId}`, `freight:{freightId}`
- Server → Client:
  - `location.update`: { freightId, lat, lng, speed, timestamp }
  - `freight.status`: { freightId, status, timestamp }
- Client → Server:
  - `room.join`: { type: "driver"|"freight", id }
  - `room.leave`: { type, id }

Frequência e limites:

- Emissão de `location.update` ~2s por frete ativo; backpressure: descartar emissões se fila por socket > 5.

## 10. Regras de Negócio

- RB1: Status: created → in_transit → delivered | cancelled.
- RB2: Integridade referencial obrigatória para driver/truck em fretes.
- RB3: Truck pode ou não estar associado a driver.

## 11. Aceitação Técnica

- Lint sem erros; unit >= 70%; e2e mínimos passando.
- Swagger em `/api/docs` com exemplos.
- `docker-compose up` sobe API + Postgres (+ Adminer opcional).

## 12. Marcos (Milestones)

- M1: Auth + CRUD Drivers/Trucks + Swagger + DB/migrations.
- M2: Freights + regras + índices + p95 OK.
- M3: Realtime (Socket.IO + salas + simulador).
- M4: Observabilidade + e2e + cobertura atingida.

## 13. Riscos e Mitigações

- Tempo no WebSocket: priorizar simulador e eventos essenciais.
- Desempenho SQL: planejar índices e validar com `EXPLAIN ANALYZE` cedo.
- e2e: usar Testcontainers/Docker e focar nos fluxos críticos.

## 14. Métricas e Monitoramento

- Latência p95 por endpoint; taxa de erros 4xx/5xx; TPS.
- Conexões WebSocket ativas e disconnects/drops.

## 15. Glossário

- Driver: motorista do caminhão.
- Freight: frete/viagem com origem/destino e status.
- Tracking: atualização periódica de localização via WebSocket.
