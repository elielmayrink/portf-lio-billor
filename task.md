# Plano de Ação - Projeto Backend (Portfólio Billor)

## 0. Objetivo e Critérios de Sucesso

- [ ] MVP: Autenticação JWT, CRUD de Motoristas/Caminhões/Fretes, rastreamento em tempo real simulado.
- [ ] p95 < 200ms em CRUDs sob 50 rps em ambiente local.
- [ ] Cobertura mínima 70% em testes unitários; e2e para fluxos críticos (auth, CRUDs, tracking).

## 1. Setup do Projeto

- [x] Criar repositório no GitHub
- [x] Inicializar projeto NestJS (`nest new backend-billor`)
- [ ] Configurar TypeScript + ESLint + Prettier
- [ ] Criar estrutura de módulos base (ex: `auth`, `users`, `drivers`, `trucks`, `freights`)
- [ ] Ativar validação global (class-validator) e filtro global de erros (HttpExceptionFilter)
- [ ] Definir prefixo e versionamento da API (`/api/v1`)
- [ ] Adicionar scripts npm: `dev`, `start`, `build`, `lint`, `test`, `test:unit`, `test:e2e`
- [ ] Criar `.env.example` e validar variáveis de ambiente (zod/joi/class-validator)

## 2. Banco de Dados (PostgreSQL)

- [ ] Configurar conexão com PostgreSQL usando `@nestjs/typeorm`
- [ ] Definir convenções: snake_case, timestamps, chaves primárias/estrangeiras
- [ ] Criar entidades e migrations:
  - Usuário
  - Motorista
  - Caminhão
  - Frete
  - Pagamento
- [ ] Definir índices planejados por consultas críticas:
  - `users(email)` unique
  - `trucks(plate)` unique
  - `freights(status, driver_id)` composto
- [ ] Popular banco com seed de dados fake (dev)
- [ ] Executar `EXPLAIN ANALYZE` nas principais queries (listar fretes por status/motorista)

## 3. Autenticação & Autorização

- [ ] Implementar autenticação com **JWT** (access tokens; refresh opcional)
- [ ] Guards e decorators de autorização (`@Roles`) com RBAC simples (admin, driver)
- [ ] Rate limiting em rotas públicas (ex.: login)
- [ ] Configurar CORS e Helmet

## 4. API REST

- [ ] Implementar CRUDs principais com DTOs e validação:
  - Motoristas
  - Caminhões
  - Fretes
- [ ] Definir contratos de API claros (Swagger/OpenAPI)
- [ ] Paginação padrão (limit/offset) e ordenação
- [ ] Idempotência para criação de pagamento (header de chave idempotente)
- [ ] Testar endpoints com Postman/Insomnia

## 5. WebSockets (Tempo Real)

- [ ] Configurar módulo de WebSocket usando `@nestjs/websockets` + `@nestjs/platform-socket.io`
- [ ] Autenticação via JWT no handshake
- [ ] Criar gateway de rastreamento (`/tracking`) com salas: `driver:{id}` e `freight:{id}`
- [ ] Simular envio de localização de caminhão a cada 2s (limitar frequência/backpressure)
- [ ] Eventos: `location.update`, `freight.status`
- [ ] Adapter configurável (in-memory | Redis no futuro)

## 6. Testes

- [ ] Criar testes unitários para services, guards e pipes
- [ ] Criar testes de integração/e2e para fluxos: auth, CRUDs, tracking
- [ ] Usar Testcontainers ou Docker para Postgres nos e2e
- [ ] Cobertura mínima 70% e geração de relatórios (lcov)
- [ ] Rodar em pipeline local (npm scripts)

## 7. Observabilidade e Performance

- [ ] Logs estruturados (contexto, requestId/correlationId)
- [ ] Interceptor de métricas (tempo de resposta p95)
- [ ] Endpoints de healthcheck (`/health`) e métricas básicas
- [ ] Revisar e otimizar queries com base em métricas/`EXPLAIN`

## 8. DX, Docker e Scripts

- [ ] `docker-compose` (PostgreSQL, API, adminer opcional)
- [ ] Makefile opcional para atalhos de desenvolvimento
- [ ] Husky pre-commit (lint + teste unitário rápido)
- [ ] Scripts de banco: `db:migrate`, `db:revert`, `db:seed`

## 9. CI/CD (mínimo)

- [ ] Pipeline: install → lint → test → build
- [ ] Build de imagem Docker (opcional) e versionamento semântico
- [ ] Publicação de artefatos (`dist/`) em cada build

## 10. Riscos & Roadmap

- [ ] Risco: escopo do WebSocket — mitigar com simulador simples primeiro
- [ ] Risco: complexidade do schema — começar com 3FN moderada e validar consultas
- [ ] Risco: tempo de testes e2e — priorizar fluxos críticos e paralelizar
- [ ] Roadmap por sprints curtas com demo ao final (MVP → tracking → observabilidade → extras)

---
