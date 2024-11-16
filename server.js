import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routes/auth.routes.js';
import jobRouter from './routes/job.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;
// connect to database
(async () => {
	await connectDb();
  })();

//middleware
app.use(express.json());
app.use(errorHandler)

//routes
app.get('/', (req, res) => {
	res.send(`Enforcatech Backend API`);
});
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobRouter);


// start server
app.listen(PORT, () =>{
	logger.info(`Server started and running on http://localhost:${PORT}`);
});
