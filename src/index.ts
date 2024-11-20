import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { prismaClient } from "./lib/db";

// Load environment variables
dotenv.config({ path: "./.env" });

// Define schema
const typeDefs = `
  type Query {
    hello: String,
  }

  type Mutation {  # The mutation type
    createUser(firstName: String!, lastName: String, email: String, password: String): Boolean
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    hello: () => "Hello, I am a GraphQl Server!!!",
  },

  Mutation: {
    createUser: async (
      _parent: any,
      {
        firstName,
        lastName,
        email,
        password,
      }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }
    ) => {
      await prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          password,
          salt: "random_salt",
        },
      });
      return true;
    },
  },
};

// Create GraphQL Server
const startServer = async () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  const gqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await gqlServer.start();

  const PORT = process.env?.PORT || 3500;
  const path: string = "/graphql";
  app.use(path, expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}${path}`);
  });
};

startServer();
