import express from 'express';
import UsersRoutes from './Routes/User.routes';
import ProductRoutes from './Routes/Product.routes';

const app = express();
app.set('port', process.env.SERVER_PORT || 3001);
app.use(express.json());
//routes
app.use('/v1/user', UsersRoutes);
app.use('/v1/product', ProductRoutes);


app.use('/', (req, res) => {
    res.json({message: 'Welcome to application astronauta'})
});

export default app;