# Frontend Billor - Teste de Autenticação

Frontend simples em HTML/CSS/JS para testar a autenticação JWT do backend.

## Como usar

1. **Certifique-se que o backend está rodando:**

   ```bash
   docker compose up -d
   ```

2. **Abra o frontend:**

   - Abra `index.html` no navegador
   - Ou use um servidor local simples:
     ```bash
     cd frontend
     python3 -m http.server 8000
     # Depois acesse http://localhost:8000
     ```

3. **Teste o login:**

   - Use as credenciais de teste:
     - **Admin:** admin@demo.local / admin123
     - **Driver:** driver@demo.local / driver123

4. **Funcionalidades:**
   - Login com validação
   - Dashboard protegido (requer JWT)
   - Verificação de status da API
   - Logout e limpeza de token
   - Redirecionamento automático

## Estrutura dos arquivos

- `index.html` - Página de login
- `dashboard.html` - Dashboard protegido
- `styles.css` - Estilos CSS
- `auth.js` - Lógica de autenticação e JWT
- `api.js` - Cliente HTTP para o backend
- `dashboard.js` - Funcionalidades do dashboard
- `index.js` - Handler do formulário de login

## Endpoints testados

- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Dados do usuário (protegido)
- `GET /api/v1/health` - Status da API

## Observações

- O frontend armazena o JWT no localStorage
- Redirecionamento automático baseado no status de auth
- Design responsivo e moderno
- Tratamento de erros da API
