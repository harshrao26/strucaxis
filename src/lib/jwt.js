import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1d' });
}

export function verifyToken(token) {
  return jwt.verify(token, secret);
}