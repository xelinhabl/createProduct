import { gql } from "@apollo/client"

// LOGIN
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

// CREATE
export const CREATE_PRODUTO = gql`
  mutation CreateProduto(
    $nome: String!
    $quantidade: Int!
    $origem: String!
    $sku: String!
    $descricao: String
  ) {
    createProduto(
      nome: $nome
      quantidade: $quantidade
      origem: $origem
      sku: $sku
      descricao: $descricao
    ) {
      id
      nome
      quantidade
      origem
      sku
      descricao
    }
  }
`

// UPDATE
export const UPDATE_PRODUTO = gql`
  mutation UpdateProduto(
    $id: ID!
    $nome: String
    $quantidade: Int
    $origem: String
    $sku: String
    $descricao: String
  ) {
    updateProduto(
      id: $id
      nome: $nome
      quantidade: $quantidade
      origem: $origem
      sku: $sku
      descricao: $descricao
    ) {
      id
      nome
      quantidade
      origem
      sku
      descricao
    }
  }
`

// DELETE
export const DELETE_PRODUTO = gql`
  mutation DeleteProduto($id: ID!) {
    deleteProduto(id: $id)
  }
`

// LIST
export const GET_PRODUTOS = gql`
  query GetProdutos {
    produtos {
      id
      nome
      quantidade
      origem
      sku
      descricao
      user {
        id
        name
      }
    }
  }
`
