import User from "../models/User.js";
import generateToken from '../utils/generateToken.js';
import { generateTokenSetCookies } from "../utils/generateTokenSetCookies.js";

export const register = async (req, res) => {

    try {
        const { username, email, password, fullName } = req.body;


        if (!username || !email || !password || !fullName) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }

        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (userExists) {
            return res.status(400).json({
                message: userExists.email === email
                    ? 'Email already registered'
                    : 'Username already taken'
            });
        }

        const user = await User.create({
            username,
            email,
            password,
            fullName
        });

        generateTokenSetCookies(user._id, res);

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(201).json({
            success: true,
            message: "User signup successfully",
            user: userObj,
        })

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            })
        }

        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: "Invalid email and password"
            })
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        generateTokenSetCookies(user._id, res);

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({
            success: true,
            message: "User login successfully",
            user: userObj,
        })


    } catch (error) {
        console.log('login error', error);
        res.status(500).json({
            message: 'server error during login'
        });
    }
}

export const logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 0,
    });
    return res.json({ message: 'Logged out successfully' });
};


export const getMe = async (req, res) => {
    try {
        // req.user is set by protect middleware
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};