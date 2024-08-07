import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { isCelebrateError } from 'celebrate';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import routes from './api/routes';
import errorHandler from './middlewares/validation/errorHandler';
import dbConnector from './config/database';

const app = express();
dotenv.config();

const port = process.env.PORT;

// Restrict the size of the request body to 50mb
app.use(json({ limit: '50mb' }));


app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

app.use(helmet());

// Connecting to db, --> we can use this after node server is up and running
dbConnector();

app.get('/', (req: Request, res: Response) => { res.send('Welcome to Danber Tech.') });

app.use('/api/v1', routes);

// We are using this middleware to handle any kind of validation error of in-coming request
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (isCelebrateError(err)) {
        return errorHandler(err, req, res, next);
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});