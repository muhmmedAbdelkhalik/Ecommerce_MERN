import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel, { type IUser } from "../models/userModel.js";

interface RequestWithUser extends Request {
    user?: any;
}

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const validateJWT = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded === 'string') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await UserModel.findOne({ email: (decoded as any).email });
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
}

export default validateJWT;