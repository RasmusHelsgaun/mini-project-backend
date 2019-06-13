import React from 'react';
import { ApolloProvider, Query, Mutation } from "react-apollo"
import gql from "graphql-tag"
import { Table, Card, Form, Button } from "react-bootstrap"

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!){
    removeUser(id: $id)
  }
`

export default ({ GET_USERS }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>username</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                <Query
                    query={GET_USERS}
                >
                    {({ loading, error, data }) => {
                        if (loading) return <p>Loading...</p>;
                        if (error) return <p>Error.. Something went wrong</p>;
                        return data.getAllUsers.map(({ id, username, email, job }) => {
                            return (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{username}</td>
                                    <td>{email}</td>
                                    <td>{job && job.map(job => job.company).join(", ")}</td>
                                    <td>
                                        <Mutation
                                            mutation={DELETE_USER}
                                            onError={(error) => alert(error)}
                                            update={(cache) => {
                                                try {
                                                    var users = cache.readQuery({ query: GET_USERS }).getAllUsers
                                                    users = users.filter(user => user.id != id)
                                                    console.log('users', users)
                                                    cache.writeQuery({
                                                        query: GET_USERS,
                                                        data: { getAllUsers: users }
                                                    })

                                                } catch (error) {
                                                    console.log(error)
                                                }
                                            }}
                                        >
                                            {removeUser => (
                                                <Button
                                                    type="submit"
                                                    onClick={e => {
                                                        e.preventDefault()

                                                        removeUser({ variables: { id } })
                                                    }}>
                                                    Delete
                                                    </Button>
                                            )}

                                        </Mutation>
                                    </td>
                                </tr>
                            )
                        })
                    }}
                </Query>

            </tbody>
        </Table>
    )
}


