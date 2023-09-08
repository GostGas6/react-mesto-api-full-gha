require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const cardRouter = require('./routes/cardRoutes');
const { returnErrorAsResponse } = require('./errors/returnErrorAsResponse');
const NotFoundError = require('./errors/classes/notFoundError');
const { requestLogger, errorLogger } = require('./middleware/logger');
const cors = require('./middleware/cors');

const {
  PORT = 3000,
  BASE_PATH = 'http://localhost',
  MONGODB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());
app.use(cors);
app.use(requestLogger);
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', cardRouter);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер под угрозой');
  }, 0);
});
app.use('*', (req, res, next) => {
  next(new NotFoundError('URL не найден'));
});
app.use(errorLogger);
app.use(errors());
app.use((error, req, res, next) => {
  returnErrorAsResponse(error, res, {});
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(`${BASE_PATH}:${PORT}`);
});
