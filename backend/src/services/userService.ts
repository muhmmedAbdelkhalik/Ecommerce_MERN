import UserModel, { type IUser } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export const register = async (params: RegisterParams) => {
    const findUser = await UserModel.findOne({ email: params.email });

    if (findUser) {
        return {
            success: false,
            message: 'User already exists',
        }
    }
    const hashedPassword = await bcrypt.hash(params.password, 10);
    params.password = hashedPassword;
    const user = await UserModel.create(params);

    return {
        success: true,
        message: 'User created successfully',
        data: user,
    };
}

interface LoginParams {
    email: string;
    password: string;
}

export const login = async (params: LoginParams) => {
    const user = await UserModel.findOne({ email: params.email });

    if (!user) {
        return {
            success: false,
            message: 'User not found',
        }
    }

    const isPasswordValid = await bcrypt.compare(params.password, user.password);

    if (!isPasswordValid) {
        return {
            success: false,
            message: 'Invalid credentials',
        }
    }

    return {
        success: true,
        message: 'Login successful',
        data: user,
        token: generateToken(user),
    }
}

export const generateToken = (user: IUser) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ email: user.email, firstName: user.firstName, lastName: user.lastName }, secret, { expiresIn: '24h' });
}