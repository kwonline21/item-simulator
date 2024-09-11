import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/characters', authMiddleware, async (req, res, next) => {
  const { nickname } = req.body;
  const { userId } = req.user;

  const isExistNickname = await prisma.characters.findFirst({
    where: { nickname },
  });
  if (isExistNickname) {
    return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
  }

  const character = await prisma.characters.create({
    data: {
      userId: +userId,
      nickname,
    },
  });

  return res.status(201).json({ data: character.characterId });
});

export default router;
