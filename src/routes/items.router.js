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

// 아이템 목록 조회 API
router.get('/items', async (req, res, next) => {
  const items = await prisma.items.findMany({
    select: {
      itemCode: true,
      itemName: true,
      itemPrice: true,
    },
  });

  return res.status(200).json({ data: items });
});

// 아이템 상세 조회 API
router.get('/items/:itemCode', async (req, res, next) => {
  const { itemCode } = req.params;

  const isExistsItem = await prisma.items.findFirst({
    where: { itemCode: +itemCode },
  });
  if (!isExistsItem) {
    return res.status(401).json({ message: '존재하지 않는 아이템입니다.' });
  }

  const item = await prisma.items.findFirst({
    where: { itemCode: +itemCode },
    select: {
      itemCode: true,
      itemName: true,
      itemStat: true,
      itemPrice: true,
    },
  });

  return res.status(200).json({ data: item });
});

export default router;
