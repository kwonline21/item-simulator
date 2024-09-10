import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`The server opened with ${PORT}ports`);
});
