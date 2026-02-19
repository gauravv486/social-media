import User from "../models/User.js";
import generateToken from '../utils/generateToken.js';

export const register = async (req, res) => {

    try {
        const { username, email, password, fullName } = req.body;

        // Validate required fields
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

        // const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password ,
            fullName
        });

        res.status(201).json({
            success: true,
            messsage: "User signup successfully",
            user: user,
            token: generateToken(user._id),
        })

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // console.log('Login attempt for username:', username);
        // console.log('Request body:', req.body);


        if (!username || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            })
        }

        const user = await User.findOne({ username }).select('+password');


        console.log('User found:', !!user);
        console.log('User object:', user ? {
            id: user._id,
            username: user.username,
            hasPassword: !!user.password,
            passwordValue: user.password ? 'exists' : 'MISSING'
        } : 'null');


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

        res.status(201).json({
            success: true,
            messsage: "User login successfully",
            user: user,
            token: generateToken(user._id),
        })


    } catch (error) {
        console.log('login error', error);
        res.status(500).json({
            message: 'server error during login'
        });
    }
}

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