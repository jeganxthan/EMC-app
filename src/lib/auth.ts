import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_dont_use_in_prod';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const signToken = (id: string, email: string) => {
  return jwt.sign({ id, email, role: 'DOCTOR' }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};

export const getUserIdFromRequest = (req: NextRequest): string | null => {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded ? decoded.id : null;
};
