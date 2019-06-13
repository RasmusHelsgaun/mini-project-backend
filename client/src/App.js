import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ApolloClient } from "apollo-boost"
import { ApolloProvider, Query, Mutation } from "react-apollo"
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from "graphql-tag"
import AddUser from "./components/AddUser"

import { Table, Card, Form, Button } from "react-bootstrap"

import UserList from "./components/UserList"

const cache = new InMemoryCache();
const link = new HttpLink({
  // uri: "https://pm2.adamlass.com/apollo"
  uri: "https://rasmushelsgaun.dk/miniproject/apollo"
})

const client = new ApolloClient({
  cache,
  link
})

const GET_USERS = gql`
{
  getAllUsers{
    id
    username
    email
    job{
      company
    }
  }
}
`

function App() {
  return (
    <div>
      <br/>
      <ApolloProvider client={client}>
        <Card>
          <Card.Header>
            <h1>Apollo Client</h1>
          </Card.Header>
          <Card.Body>
            <UserList GET_USERS={GET_USERS} />

          </Card.Body>
        </Card>
        <br />
        <Card>
          <Card.Header>
            <Card.Title>Create new user</Card.Title>

          </Card.Header>
          <Card.Body>
            <AddUser GET_USERS={GET_USERS} />

          </Card.Body>
        </Card>
    </ApolloProvider>
      </div>

  );
}

export default App;
