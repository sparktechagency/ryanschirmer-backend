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
// --------------------TEST-------------------------------
const client = new smartcar.AuthClient({
  clientId: '6e70a4df-1277-4794-a0fe-1e17bcef256f',
  clientSecret: 'eea1f0db-918f-4c95-aab2-70782f977d2a',
  redirectUri: 'https://api.unleakd.com/callback',
  mode: 'test',
});

app.get('/login', async (req, res) => {
  const scope = ['read_vehicle_info'];
  const authUrl = client.getAuthUrl(scope);

  console.log('🚀 Redirecting to Smartcar:', authUrl);

  // This can be a real page in your app; here we just send a link
  res.send(`<a href="${authUrl}">Connect your car</a>`);
});

app.get('/exchange', async function (req, res) {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send('No code in query.');
  }

  try {
    const access = await client.exchangeCode(code);
    console.log('✅ Access Token:', access.accessToken);
    console.log('🔄 Refresh Token:', access.refreshToken);
    console.log('⏰ Expires In:', access.expiresIn);

    res.send('Authorization successful! Check your terminal for tokens.');
  } catch (error) {
    console.error('❌ Token exchange error:', error);
    res.status(500).send('Token exchange failed');
  }
});

app.get('/callback', async function (req, res, next) {
  let access;

  if (req.query.error) {
    // the user denied your requested permissions

    return next(new Error(req.query.error));
  }

  // exchange auth code for access token
  const tokens = await client.exchangeCode(req.query.code);
  console.log('🚀 ~ tokens:', tokens);
  // get the user's vehicles
  const vehicles = await smartcar.getVehicles(tokens.accessToken);
  console.log('🚀 ~ vehicles:', { vehicles });
  // instantiate first vehicle in vehicle list
  const vehicle = new smartcar.Vehicle(
    vehicles.vehicles[0],
    tokens.accessToken,
  );

  console.log({ vehicle });
  // get identifying information about a vehicle
  const attributes = await vehicle.attributes();
  console.log(attributes);
  // {
  //   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
  //   "make": "TESLA",
  //   "model": "Model S",
  //   "year": 2014
  //   "meta": {
  //     "requestId": "ada7207c-3c0a-4027-a47f-6215ce6f7b93"
  //   }
  // }
});

// --------------------END TEST-------------------------------
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
