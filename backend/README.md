# Backend para EduFlix - Plataforma de Cursos Online (MySQL)

## 1. Visão Geral

Este é o backend para a aplicação frontend EduFlix. Ele fornece uma API RESTful para gerenciar usuários, categorias, cursos, vídeos, arquivos e matrículas, utilizando Node.js, Express.js e **MySQL**. Substitui a lógica baseada em `localStorage` do frontend original por um sistema persistente e robusto.

## 2. Pré-requisitos

Antes de começar, certifique-se de ter instalado:

*   Node.js (versão 18.x ou superior recomendada)
*   npm (geralmente vem com o Node.js)
*   **MySQL** (versão 8.x ou superior recomendada)

## 3. Instalação

1.  **Copie o Código:** Copie o diretório `backend` para o local desejado.
2.  **Navegue até o Diretório:** Abra um terminal e navegue até o diretório `backend`:
    ```bash
    cd path/to/backend
    ```
3.  **Instale as Dependências:** Execute o seguinte comando para instalar todas as dependências do projeto (incluindo `mysql2` e `uuid`):
    ```bash
    npm install
    ```

## 4. Configuração do Banco de Dados (MySQL)

1.  **Acesse o MySQL:** Conecte-se ao seu servidor MySQL (por exemplo, usando o cliente `mysql`):
    ```bash
    mysql -u root -p 
    ```
    (Substitua `root` pelo seu usuário MySQL, se diferente. Você será solicitado a digitar a senha).
2.  **Crie o Banco de Dados:**
    ```sql
    CREATE DATABASE eduflix_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```
3.  **Crie o Usuário:** **IMPORTANTE:** Substitua `password` por uma senha forte e segura.
    ```sql
    CREATE USER 'eduflix_user'@'localhost' IDENTIFIED BY 'password';
    ```
    *(Se o backend for rodar em uma máquina diferente do banco de dados, substitua `'localhost'` pelo host ou IP do backend, ou use `'%'` para permitir qualquer host - menos seguro).* 
4.  **Conceda Privilégios:**
    ```sql
    GRANT ALL PRIVILEGES ON eduflix_db.* TO 'eduflix_user'@'localhost';
    ```
5.  **Atualize os Privilégios:**
    ```sql
    FLUSH PRIVILEGES;
    ```
6.  **Saia do MySQL:**
    ```sql
    EXIT;
    ```
7.  **Execute o Script de Inicialização:** Execute o script `init.sql` para criar as tabelas. Use o cliente `mysql` para conectar ao banco `eduflix_db` com o usuário recém-criado:
    ```bash
    mysql -u eduflix_user -p eduflix_db < init.sql
    ```
    (Você será solicitado a digitar a senha definida no passo 3).

## 5. Configuração do Ambiente

1.  **Crie o Arquivo `.env`:** Na raiz do diretório `backend`, crie um arquivo chamado `.env` (se já não existir).
2.  **Copie o Conteúdo:** Copie o seguinte conteúdo para o arquivo `.env` e ajuste os valores conforme necessário:
    ```dotenv
    # Variáveis de Ambiente para Backend EduFlix (MySQL)
    
    # Configurações do Banco de Dados MySQL
    DB_HOST=localhost    # Ou o host onde seu MySQL está rodando
    DB_PORT=3306         # Porta padrão do MySQL
    DB_USER=eduflix_user
    DB_PASSWORD=password # Use a senha que você definiu para o usuário eduflix_user
    DB_DATABASE=eduflix_db
    
    # Segredo para JSON Web Token (JWT)
    # IMPORTANTE: Gere um segredo JWT forte e único para produção!
    JWT_SECRET=seu_segredo_jwt_super_secreto_aqui 
    
    # Porta em que o servidor backend irá rodar
    PORT=5000
    
    # Ambiente (opcional, mas recomendado)
    # NODE_ENV=development # Mude para 'production' em ambiente de produção
    ```
3.  **Segredo JWT:** **É crucial** gerar um segredo JWT longo, aleatório e seguro para a variável `JWT_SECRET` em um ambiente de produção. Não use o valor padrão.

## 6. Executando a Aplicação

*   **Modo de Desenvolvimento:** Para rodar o servidor com reinicialização automática ao detectar alterações nos arquivos (usando `nodemon`):
    ```bash
    npm run dev
    ```
    O servidor estará disponível em `http://localhost:5000` (ou a porta definida em `.env`).

*   **Modo de Produção:** Para rodar o servidor em modo de produção (usando `node`):
    ```bash
    npm start
    ```
    Certifique-se de definir `NODE_ENV=production` como variável de ambiente do sistema para otimizações e segurança.

## 7. Endpoints da API

A API segue uma estrutura RESTful. Os principais grupos de rotas são:

*   `/auth`: Registro e Login de usuários.
*   `/api/users`: Gerenciamento de usuários (perfil, CRUD de admin).
*   `/api/categories`: CRUD de categorias.
*   `/api/courses`: CRUD de cursos.
*   `/api/videos`: CRUD de vídeos.
*   `/api/files`: CRUD de metadados de arquivos.
*   `/api/enrollments`: Gerenciamento de matrículas em cursos.
*   `/api/upload`: Upload de arquivos.

Consulte os arquivos dentro de `src/routes/` para detalhes específicos de cada endpoint e os métodos HTTP associados.

## 8. Autenticação

A autenticação é feita via JSON Web Tokens (JWT). Após o login (`/auth/login`), um token é retornado. Para acessar rotas protegidas, inclua o token no cabeçalho `Authorization` da requisição:

```
Authorization: Bearer <seu_token_jwt>
```

Rotas administrativas requerem que o usuário autenticado tenha o papel (`role`) de `admin`.

## 9. Upload de Arquivos

*   Os arquivos são enviados para o endpoint `/api/upload/single` (via POST, como `multipart/form-data`, com o campo do arquivo nomeado `file`).
*   O backend salva o arquivo no diretório `/uploads` na raiz do projeto.
*   Este diretório é servido estaticamente, ou seja, os arquivos podem ser acessados via `http://<seu_host>:<porta>/uploads/<nome_do_arquivo>`.
*   O endpoint de upload retorna a URL relativa (`/uploads/<nome_do_arquivo>`) e outros metadados.
*   **Fluxo Típico:**
    1.  O frontend envia o arquivo para `/api/upload/single`.
    2.  O frontend recebe a URL do arquivo (ex: `/uploads/imagem-curso-123.jpg`).
    3.  O frontend faz uma requisição para criar/atualizar uma entidade (ex: `POST /api/courses`), incluindo a URL recebida no corpo da requisição (ex: `image_url: "/uploads/imagem-curso-123.jpg"`).

## 10. Implantação (Deployment)

Para implantar o backend em um servidor de produção:

1.  **Variáveis de Ambiente:** Configure as variáveis de ambiente (`.env` ou variáveis do sistema) corretamente, especialmente `NODE_ENV=production`, `JWT_SECRET` e as credenciais do banco de dados.
2.  **Banco de Dados:** Certifique-se de que o servidor de produção possa acessar o banco de dados **MySQL**.
3.  **Dependências:** Instale apenas as dependências de produção:
    ```bash
    npm install --omit=dev # npm 7+ ou use --production para versões anteriores
    ```
4.  **Process Manager:** Use um gerenciador de processos como o PM2 para manter a aplicação rodando, reiniciar em caso de falhas e gerenciar logs:
    ```bash
    npm install pm2 -g
    pm2 start app.js --name eduflix-backend
    ```
5.  **Reverse Proxy (Recomendado):** Configure um servidor web como Nginx ou Apache como um reverse proxy na frente da aplicação Node.js. Isso permite lidar com HTTPS (SSL/TLS), balanceamento de carga, servir arquivos estáticos de forma eficiente e adicionar uma camada extra de segurança.
6.  **Diretório `uploads`:** Garanta que o diretório `uploads` tenha as permissões corretas de escrita para o usuário que executa a aplicação Node.js e que ele seja persistente entre implantações (não seja apagado ao atualizar o código).
7.  **CORS:** Configure as opções de CORS (`cors` middleware em `app.js`) de forma mais restritiva em produção, permitindo apenas a origem do seu frontend.
8.  **HTTPS:** Configure HTTPS (essencial para segurança) através do reverse proxy.

## 11. Considerações de Segurança

*   **Senhas:** Use senhas fortes para o banco de dados. Não use a senha padrão `password` em produção.
*   **JWT Secret:** Use um `JWT_SECRET` longo, aleatório e mantenha-o seguro.
*   **Validação de Entrada:** Embora haja alguma validação básica, considere adicionar validação mais robusta (ex: usando `express-validator`) para proteger contra dados maliciosos.
*   **HTTPS:** Sempre use HTTPS em produção.
*   **Limitação de Taxa (Rate Limiting):** Considere adicionar limitação de taxa às suas rotas de API para prevenir abuso.
*   **Atualizações:** Mantenha as dependências (npm packages) atualizadas para corrigir vulnerabilidades de segurança.

## 12. Estrutura do Projeto

```
/backend
├── src/
│   ├── config/       # Configuração (DB, etc.)
│   ├── controllers/  # Lógica de requisição/resposta HTTP
│   ├── middleware/   # Middlewares (auth, error, upload)
│   ├── models/       # Interação com o banco de dados
│   ├── routes/       # Definição das rotas da API
│   ├── utils/        # Funções utilitárias (auth)
│   └── app.js        # Configuração principal do Express
├── uploads/          # Diretório para arquivos carregados
├── .env              # Variáveis de ambiente (NÃO versionar)
├── init.sql          # Script de inicialização do DB (MySQL)
├── package.json
├── package-lock.json
└── README.md         # Este arquivo
```

