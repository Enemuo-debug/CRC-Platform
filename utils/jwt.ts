import type { LoginDto } from "../dtos/ADMINLogIn.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv"

config();

const JWT_SECRET: string = process.env.JWT_Key as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export function signToken(payload: LoginDto) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d"
  });
}

export function verifyToken(token: string): LoginDto {
  if (!token) {
    return null as unknown as LoginDto;
  }
  return jwt.verify(token, JWT_SECRET) as LoginDto;
}
