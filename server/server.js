import express from 'express';
import connectDB from './src/config/database.js';
import dotenv from "dotenv";
import authRoutes from './src/routes/authRoutes.js';
import postRoutes from './src/routes/postRoutes.js'
import cors from 'cors'
import useRoutes from './src/routes/userRoutes.js'
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://nexussocialmedia.vercel.app',
        /\.vercel\.app$/,
    ],
    credentials: true,
}));


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', useRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'social media api is running' });
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
});

const startServer = async () => {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`server is running on ${port}`));
};

startServer();

export default app;