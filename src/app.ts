/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import notFound from './app/middleware/notfound';
import router from './app/routes';
import axios from 'axios';
import smartcar from 'smartcar';
const app: Application = express();
app.use(express.static('public'));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

// Remove duplicate static middleware
// app.use(app.static('public'));

// application routes
app.use('/api/v1', router);
app.post('/return', async (req, res) => {
  try {
    console.log('---------------------------->>');
    const url = 'http://192.168.10.43:5010/api/v1/payments/redirect';
    const body = req.body;
    const query = req.query;
    const data = await axios.post(url, body, {
      params: query, // These are query parameters (?search=example&page=2)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(data?.data);
    res.send({ success: true, message: 'success' });
  } catch (error: any) {
    console.log(error);
    res.send({ success: false, message: error?.messages });
  }
});
app.post('/', async (req, res) => {
  try {
    console.log('---------------------------->>');
    const url = 'http://192.168.10.43:5010/api/v1/payments/callback';
    const body = req.body;
    const query = req.query;
    const data = await axios.post(url, body, {
      params: query, // These are query parameters (?search=example&page=2)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(data?.data);
    res.send({ success: true, message: 'success' });
  } catch (error: any) {
    console.log(error);
    res.send({ success: false, message: error?.messages });
  }
});
app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
