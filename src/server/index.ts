import express from "express";
import { createServer } from "http";
import { AddressInfo } from "net";
import { resolve, basename } from "path";
import { ApolloServer, gql } from "apollo-server-express";
import { readFileSync, readdirSync } from "fs";

const typeDefs = gql`
  ${readFileSync(resolve(__dirname, "../../../../schema.graphql"))}
`;

function getResolvers(type) {
  const resolverList = {};
  for (let filename of readdirSync(
    resolve(__dirname, "../../../../src/resolvers/", type)
  )) {
    resolverList[basename(basename(filename, ".ts"), ".js")] = require(resolve(
      __dirname,
      "../../../../src/resolvers/",
      type,
      filename
    )).default;
  }
  return resolverList;
}

const Query = getResolvers("query");
const Subscription = getResolvers("subscription");
const Mutation = getResolvers("mutation");

const resolvers = {
  Subscription,
  Query,
  Mutation,
};

const app = express();
const server = createServer(app);
const apolloServer = new ApolloServer({ typeDefs, resolvers });

app.use(express.static("./dist"));

apolloServer.applyMiddleware({ app });

app.use((req, res, next) => {
  res.sendFile(resolve(__dirname, "../../../../dist/index.html"));
});

apolloServer.installSubscriptionHandlers(server);

server.listen({ port: process.env.PORT || 9000, address: "0.0.0.0" }, () => {
  const address = server.address() as AddressInfo;
  console.log(`🚀 Listening on http://${address.address}:${address.port}`);
});
