import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// sign-up API
router.post('/sign-up', async (req, res, next) => {
  const { id, password, repeatPassword, name } = req.body;

  // ID 조건
  const idValidity = /^[a-z0-9]+$/;
  if (!idValidity.test(id)) {
    return res
      .status(400)
      .json({ message: '아이디는 영어 소문자와 숫자로만 입력해 주세요.' });
  }

  // 비밀번호 조건
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: '비밀번호는 최소 6자 이상으로 입력해 주세요.' });
  }

  // 비밀번호 재확인
  if (password !== repeatPassword) {
    return res
      .status(400)
      .json({ message: '재확인 비밀번호가 일치하지 않습니다.' });
  }

  // 존재하는 아이디 확인
  const isExistUser = await prisma.users.findFirst({
    where: { id },
  });

  if (isExistUser) {
    return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
  }

  // password 암호화 & user 생성
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      id,
      password: hashedPassword,
      name,
    },
  });

  // 가입성공
  return res
    .status(201)
    .json({ message: '회원가입이 완료되었습니다.', data: user });
});

// sign-in API
router.post('/sign-in', async (req, res, next) => {
  const { id, password } = req.body;

  const user = await prisma.users.findFirst({ where: { id } });

  if (!user) {
    return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  const token = jwt.sign({ userId: user.userId }, 'custom-secret-key');

  res.cookie('authorization', `Bearer ${token}`);
  return res.status(200).json({ message: '로그인에 성공하였습니다.' });
});

export default router;
