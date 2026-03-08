import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecret"; // depois moveremos para .env

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    storeId: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token não enviado"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    req.user = {
      userId: decoded.userId,
      storeId: decoded.storeId
    };

    next();

  } catch (error) {
    return res.status(401).json({
      error: "Token inválido"
    });
  }
}