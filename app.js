import express from 'express';
import cookieParser from 'cookie-parser';
import UsersRouter from './routers/users.router.js';
import DocumentsRouter from './routers/documents.router.js';
import errorHandlingMiddleware from './middlewares/error-handling.middleware.js';
import logMiddleware from './middlewares/log.middleware.js';

const app = express();
const PORT = 3316;

app.use(logMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use('/api', [UsersRouter, DocumentsRouter]);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
