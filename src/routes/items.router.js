import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 아이템 생성 API
router.post('/items', async (req, res, next) => {
  const { itemName, itemStat, itemPrice } = req.body;

  const isExistItem = await prisma.items.findFirst({
    where: { itemName },
  });

  if (isExistItem) {
    return res
      .status(409)
      .json({ message: '이미 존재하는 아이템 이름입니다.' });
  }

  const item = await prisma.items.create({
    data: {
      itemName,
      itemStat,
      itemPrice,
    },
  });

  return res
    .status(201)
    .json({ message: '아이템 생성이 완료되었습니다.', data: item });
});

export default router;
