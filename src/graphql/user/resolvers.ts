import UserService, { CreateUserPayloadType } from "./../../services/user";

const queries = {
  getUserToken: (parent: any, payload: { email: string; password: string }) => {
    const token = UserService.getUserToken({
      email: payload.email,
      password: payload.password,
    });

    return token;
  },
};

const mutations = {
  createUser: async (parent: any, payload: CreateUserPayloadType) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = { queries, mutations };
