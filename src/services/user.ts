import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";

export interface CreateUserPayloadType {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  salt?: string;
}

export interface GetUserTokenPayloadType {
  email: string;
  password: string;
}

class UserService {
  private static generateHash(salt: string, password: string): string {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  private static validatePassword(password: string): void {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include letters and numbers."
      );
    }
  }

  public static async createUser(payload: CreateUserPayloadType) {
    const { firstName, lastName, email, password } = payload;

    this.validatePassword(password);

    const salt = randomBytes(16).toString("hex");
    const hashPassword = this.generateHash(salt, password);

    try {
      return await prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          salt,
          password: hashPassword,
        },
      });
    } catch (error) {
      throw new Error("Failed to create user. Please try again later.");
    }
  }

  private static getUserbyEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  public static async getUserToken(payload: GetUserTokenPayloadType) {
    const { email, password } = payload;
    const user = await UserService.getUserbyEmail(email);
    if (!user) throw new Error("Invalid email or password.");

    if (!user.salt)
      throw new Error("User salt is missing. Please contact support.");

    const userHashPassword = this.generateHash(user.salt, password);
    if (userHashPassword !== user.password)
      throw new Error("Invalid email or password.");

    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  }
}

export default UserService;
