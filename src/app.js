import express from 'express';
import cookieParser from 'cookie-parser';
import UsersRouter from './routes/users.router.js';
import CharactersRouter from './routes/characters.router.js';

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cookieParser());

app.use('/api', [UsersRouter, CharactersRouter]);

app.listen(PORT, () => {
  console.log(`The server opened with ${PORT}ports`);
});
