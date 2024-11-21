import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { prismaClient } from "./lib/db";
import createApolloGraphqlServer from "./graphql";

// Load environment variables
dotenv.config({ path: "./.env" });

// Create GraphQL Server
const startServer = async () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  const gqlServer = await createApolloGraphqlServer();

  const PORT = process.env?.PORT || 3500;
  const path: string = "/graphql";
  app.use(path, expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}${path}`);
  });
};

startServer();
