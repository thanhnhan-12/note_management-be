import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/User';
import TokenBlacklist from '../models/TokenBlacklist';

interface CustomJwtPayload extends jwt.JwtPayload {
    id: number;
}

export const signUp = async (req: Request, res: Response): Promise<any> => {
    const { firstName, lastName, phone, password, confirmPassword } = req.body;

    console.log("Body: ", req.body);

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    try {
        const newUser = await User.create({
            firstName,
            lastName,
            phone,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "User registered successfully.", userId: newUser.id });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'test';

export const signIn = async (req: Request, res: Response): Promise<any> => {
    const { phone, password } = req.body;

    console.log("Body: ", req.body);

    try {
        // Find user by phone
        const user = await User.findOne({ where: { phone } });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check password
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, {
            expiresIn: '1h', // Token expiration time
        });

        return res.status(200).json({
            message: "Login successful.",
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
            },
            token,
        });
    } catch (error) {
        console.error("Error signing in:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const signOut = async (req: Request, res: Response): Promise<any> => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: "No refresh token provided." });
    }

    try {
        await TokenBlacklist.create({ token: refreshToken });

        return res.status(200).json({ message: "User signed out successfully." });
    } catch (error) {
        console.error("Error signing out:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const getUserInformation = async (req: Request, res: Response): Promise<any> => {
    const userId = req.params.id;

    try {
        // Fetch the user information from the database
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const { password, ...userInfo } = user.toJSON();
        return res.status(200).json(userInfo);
    } catch (error) {
        console.error("Error fetching user information:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided." });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'test') as CustomJwtPayload;

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(403).json({ message: "User not found." });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || 'test',
            { expiresIn: '15m' }
        );

        return res.status(200).json({
            accessToken: newAccessToken,
            message: "Access token refreshed successfully."
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        return res.status(401).json({ message: "Invalid refresh token." });
    }
};