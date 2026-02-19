import express from 'express';
import connectDB from './src/config/database.js';
import dotenv from "dotenv";
import authRoutes from './src/routes/authRoutes.js';
import postRoutes from './src/routes/postRoutes.js'
import cors from 'cors'

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Your React app URL
    credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts' , postRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'socail media api is running' });
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

export default app;

await connectDB();
const port = 5000;
app.listen(port, () => console.log(`server is running on ${port}`));