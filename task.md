# Task List - Portfólio Billor Backend

## ✅ Setup do Projeto

- [x] Criar repositório no GitHub
- [x] Inicializar projeto NestJS
- [x] Configurar TypeScript + ESLint + Prettier
- [x] Criar estrutura de módulos base (ex: `auth`, `users`, `drivers`, `trucks`, `freights`)
- [x] Criar `.env.example` e validar variáveis de ambiente (zod/joi/class-validator)
- [x] Definir convenções: snake_case, timestamps, chaves primárias/estrangeiras
- [x] Definir índices planejados por consultas críticas: `users(email)` unique, `trucks(plate)` unique, `freights(status, driver_id)` composto
- [x] Executar `EXPLAIN ANALYZE` nas principais queries (listar fretes por status/motorista)

## ✅ Configuração Base

- [x] Ativar validação global (class-validator) e filtro global de erros (HttpExceptionFilter)
- [x] Definir prefixo e versionamento da API (`/api/v1`)
- [x] Adicionar scripts npm: `dev`, `start`, `build`, `lint`, `test`, `test:unit`, `test:e2e`
- [x] Configurar CORS e Helmet
- [x] Endpoints de healthcheck (`/health`) e métricas básicas
- [x] `docker-compose` (PostgreSQL, API, adminer opcional)
- [x] Scripts de banco: `db:migrate`, `db:revert`, `db:seed`

## ✅ API REST

- [x] Implementar CRUDs principais com DTOs e validação: Motoristas, Caminhões, Fretes
- [x] Definir contratos de API claros (Swagger/OpenAPI)
- [x] Paginação padrão (limit/offset) e ordenação
- [x] Idempotência para criação de pagamento (header de chave idempotente)
- [x] Testar endpoints com Postman/Insomnia

## ✅ Frontend (MVP)

- [x] Login + Dashboard protegido (JWT)
- [x] Users: listar/criar/editar/deletar (UI)
- [x] Trucks: listar/criar/editar/deletar (UI)
- [x] Drivers: listar/criar/editar/deletar (UI)
- [x] Proteção de rotas (auth.js) para dashboard/users/trucks/drivers

## ✅ Banco de Dados

- [x] Configurar conexão com PostgreSQL usando `@nestjs/typeorm`
- [x] Criar entidades e migrations: Usuário, Motorista, Caminhão, Frete, Pagamento
- [x] Popular banco com seed de dados fake (dev)

## ✅ Autenticação & Autorização

- [x] Implementar autenticação com **JWT** (access tokens; refresh opcional)
- [x] Guards e decorators de autorização (`@Roles`) com RBAC simples (admin, driver)
- [x] Rate limiting em rotas públicas (ex.: login)

## 🔄 WebSockets

- [ ] Configurar módulo de WebSocket usando `@nestjs/websockets` + `@nestjs/platform-socket.io`
- [ ] Autenticação via JWT no handshake
- [ ] Criar gateway de rastreamento (`/tracking`) com salas: `driver:{id}` e `freight:{id}`
- [ ] Simular envio de localização de caminhão a cada 2s (limitar frequência/backpressure)
- [ ] Eventos: `location.update`, `freight.status`
- [ ] Adapter configurável (in-memory | Redis no futuro)

## 🔄 Testes

- [ ] Criar testes unitários para services, guards e pipes
- [ ] Criar testes de integração/e2e para fluxos: auth, CRUDs, tracking
- [ ] Usar Testcontainers ou Docker para Postgres nos e2e
- [ ] Cobertura mínima 70% e geração de relatórios (lcov)
- [ ] Rodar em pipeline local (npm scripts)

## 🔄 Observabilidade e Performance

- [ ] Logs estruturados (contexto, requestId/correlationId)
- [ ] Interceptor de métricas (tempo de resposta p95)
- [ ] Revisar e otimizar queries com base em métricas/`EXPLAIN`

## 🔄 DX, Docker e Scripts

- [ ] Makefile opcional para atalhos de desenvolvimento
- [ ] Husky pre-commit (lint + teste unitário rápido)

## 🔄 CI/CD

- [ ] Pipeline: install → lint → test → build
- [ ] Build de imagem Docker (opcional) e versionamento semântico
- [ ] Publicação de artefatos (`dist/`) em cada build

## 📝 Notas de Implementação (atualizadas)

### Drivers & Trucks Backend ✅

- Modules: `DriversModule`, `TrucksModule`, services robustos com validações e erros padronizados
- DTOs com `class-validator` e documentação no Swagger
- Queries com paginação, filtros (status/userId para drivers; driverId/year/search para trucks) e ordenação

### Frontend (Users/Drivers/Trucks) ✅

- Páginas: `users.html`, `drivers.html`, `trucks.html`
- CRUDs rápidos com feedback visual e proteção de rotas
- Drivers: select de usuários populado via `/users`, validação (nome ≥ 3, CNH 11 dígitos)
- Trucks: validação básica (formato de placa e ano) prevista para ajuste

### Seed & Dados

- Usuários seed (admin, driver) e inserções assistidas para drivers/trucks (dev)
