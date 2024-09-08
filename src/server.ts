import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());



// IMPORT ROUTES
import dbConnection from './config/db_Connection';
import userRoutes from './routes/authRoute';
import categoryRoutes from './routes/categoryRoute';
import stockRoutes from './routes/stockRoute';
import productRoutes from './routes/productRoute';
// import orderRoutes from './routes/orderRoutes';
// import cartRoutes from './routes/cartRoutes';


app.get('/', (req, res) => {
    res.status(200).send('Hello World');
})
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/stocks', stockRoutes);
app.use('/api/v1/products', productRoutes);

const PORT:number = process.env.PORT ? +process.env.PORT:5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    dbConnection();
})