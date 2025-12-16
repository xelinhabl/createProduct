CreateProduct – GraphQL + Prisma + Docker

Projeto fullstack para criação de usuários e produtos, utilizando GraphQL, Prisma ORM, PostgreSQL e Docker, com foco em ambiente de desenvolvimento local.

🚀 Tecnologias Utilizadas
Backend / API

Node.js

Next.js (App Router)

GraphQL

Prisma ORM

PostgreSQL

JWT (autenticação)

Infraestrutura

Docker

Docker Compose

🏗️ Arquitetura do Projeto
createProduct/
├── app/
│   ├── api/
│   │   └── graphql/
│   │       ├── resolvers.ts
│   │       ├── typeDefs.ts
│   │       └── context.ts
│   └── page.tsx
├── prisma/
│   └── schema.prisma
├── generated/
│   └── prisma/
│       └── client
├── .env
├── Dockerfile
├── docker-compose.yml
└── README.md

🔐 Funcionalidades

✅ Cadastro de usuários

✅ Login com JWT

✅ CRUD de produtos

✅ Relacionamento Usuário → Produtos

✅ Listagem de usuários e produtos

✅ Banco de dados PostgreSQL

✅ Ambiente Dockerizado para desenvolvimento

⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado:

Docker

Docker Compose

Git

👉 Não é necessário instalar Node.js nem PostgreSQL localmente.

🐳 Como rodar o projeto com Docker (modo desenvolvimento)
1️⃣ Clone o repositório
git clone https://github.com/xelinhabl/createProduct.git
cd createProduct

2️⃣ Crie o arquivo .env

Na raiz do projeto:

DATABASE_URL="postgresql://postgres:postgres@db:5432/myapp?schema=public"
JWT_SECRET="chaveSecreta"

3️⃣ Suba os containers
docker compose up -d


Verifique se os containers estão rodando:

docker compose ps

4️⃣ Execute as migrations do Prisma

⚠️ IMPORTANTE: Esse comando deve ser executado dentro do container.

docker compose exec app sh


Dentro do container:

npx prisma generate
npx prisma migrate dev --name init


Saia do container:

exit

5️⃣ Acesse a aplicação

API GraphQL:
👉 http://localhost:3000/api/graphql

🧪 Exemplos de Queries GraphQL
🔹 Criar usuário
mutation {
  createUser(
    name: "João"
    email: "joao@email.com"
    password: "123456"
  ) {
    id
    name
    email
  }
}

🔹 Login
mutation {
  login(
    email: "joao@email.com"
    password: "123456"
  ) {
    token
    user {
      id
      name
    }
  }
}

🔹 Listar usuários
query {
  users {
    id
    name
    email
  }
}

🔹 Criar produto
mutation {
  createProduto(
    nome: "iPhone"
    quantidade: 10
    origem: "Importado"
    sku: "IP123"
    descricao: "iPhone 15"
  ) {
    id
    nome
  }
}

⚠️ Observações Importantes

O serviço db só é acessível dentro da rede Docker

Sempre execute comandos do Prisma usando:

docker compose exec app sh


Se ocorrer erro de conexão com o banco:

docker compose down -v
docker compose up -d

📌 Próximas melhorias sugeridas

🔐 Proteção de resolvers com middleware de autenticação

🧪 Seed automático de dados

🚀 Build de produção com Docker

🧩 Testes automatizados

👨‍💻 Autor

Desenvolvido por Xelinhabl
📎 GitHub: https://github.com/xelinhabl