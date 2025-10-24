import { type Request, type Response, type NextFunction } from 'express';

import jwt from 'jsonwebtoken'
import { AddUser } from '../db/dummy.db.ts';
import User from '../type/User.ts';

export function isLogged(req: Request, res: Response, next: NextFunction) {
    // TODO: implemente logic
    // const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer TOKEN"

    // if (!token) {
    //     return res.status(401).json({ message: 'No token provided' });
    // }

    // try {
    //     const decoded = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key'
    //     req.user = decoded; // Attach user info to request
    //     next();
    // } catch (err) {
    //     return res.status(401).json({ message: 'Invalid token' });
    // }
};

export function login(req: Request, res: Response, next: NextFunction) {
    // TODO: implement login logic here
}

export function register(req: Request, res: Response, next: NextFunction) {
    // TODO: implement register logic here
    const user: User = {
        id: "",
        name: "",
        joined: "",
        password: "",
        phone: "",
        status: 'created'
    }
    AddUser(user)
}

export function changePassword(req: Request, res: Response, next: NextFunction) {
    // TODO: implement change password logic here
}

export function getOtp(req: Request, res: Response, next: NextFunction) {
    // TODO: implement generate otp logic here
}

export function verifyOTP(req: Request, res: Response, next: NextFunction) {
    // TODO: implement otp verification logic here
}