"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./lib/db");
// Load environment variables
dotenv_1.default.config({ path: "./.env" });
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
        createUser: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { firstName, lastName, email, password, }) {
            yield db_1.prismaClient.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password,
                    salt: "random_salt",
                },
            });
            return true;
        }),
    },
};
// Create GraphQL Server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    const gqlServer = new server_1.ApolloServer({
        typeDefs,
        resolvers,
    });
    yield gqlServer.start();
    const PORT = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.PORT) || 3500;
    const path = "/graphql";
    app.use(path, (0, express4_1.expressMiddleware)(gqlServer));
    app.listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}${path}`);
    });
});
startServer();
