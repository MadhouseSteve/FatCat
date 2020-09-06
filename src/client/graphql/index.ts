import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { split } from "apollo-link";
import gql from "graphql-tag";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({ uri: "http://localhost:9000/graphql" });
const wsLink = new WebSocketLink({
  uri: `ws://localhost:9000/graphql`,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export async function query<T>(query: string, variables?: object): Promise<T> {
  return client
    .query({
      query: gql`
        ${query}
      `,
      variables,
    })
    .then((response) => response.data);
}

export function subscribe<T>(query: string, variables?: object) {
  return client.subscribe<T>({
    query: gql`
      ${query}
    `,
    variables,
  });
}

export async function mutate<T>(query: string, variables?: object): Promise<T> {
  return client
    .mutate({
      mutation: gql`
        ${query}
      `,
      variables,
    })
    .then((response) => response.data);
}
