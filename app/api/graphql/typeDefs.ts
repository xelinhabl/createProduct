export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Produto {
    id: ID!
    nome: String!
    quantidade: Int!
    origem: String!
    sku: String!
    descricao: String
    user: User
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    produtos: [Produto!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
    createProduto(
      nome: String!
      quantidade: Int!
      origem: String!
      sku: String!
      descricao: String
    ): Produto!
    updateProduto(
      id: ID!
      nome: String
      quantidade: Int
      origem: String
      sku: String
      descricao: String
    ): Produto!
    deleteProduto(id: ID!): Boolean!
    deleteUser(id: ID!): Boolean!
  }
`