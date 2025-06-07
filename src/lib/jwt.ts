import jwt from 'jsonwebtoken';

const SECRET: jwt.Secret = process.env.JWT_SECRET || 'your-secret-key';

export function signToken(payload: object, signOptions: jwt.SignOptions) {
    return jwt.sign(payload, SECRET, signOptions);
}

export function verifyToken(token: string) {
    return jwt.verify(token, SECRET);
}