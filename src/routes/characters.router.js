import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 캐릭터 생성 API
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

// 캐릭터 삭제 API
router.delete(
  '/characters/:characterId',
  authMiddleware,
  async (req, res, next) => {
    const { characterId } = req.params;

    const character = await prisma.characters.findUnique({
      where: {
        characterId: +characterId,
      },
    });

    if (!character) {
      return res.status(404).json({ message: '캐릭터가 존재하지 않습니다.' });
    }

    await prisma.characters.delete({ where: { characterId: +characterId } });

    return res.status(200).json({ message: '캐릭터가 삭제되었습니다.' });
  }
);

// 캐릭터 상세 조회 API
router.get(
  '/characters/:characterId',
  authMiddleware,
  async (req, res, next) => {
    const { characterId } = req.params;
    const { userId } = req.user;

    const character = await prisma.characters.findFirst({
      where: { characterId: +characterId },
      select: {
        userId: true,
        nickname: true,
        health: true,
        power: true,
        money: true,
      },
    });

    // 요청한 사람이 캐릭터의 소유자가 아닐 경우
    if (userId !== character.userId) {
      delete character.money;
    }

    return res.status(200).json({ data: character });
  }
);

export default router;
