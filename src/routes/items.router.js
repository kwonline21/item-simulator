import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 아이템 생성 API
router.post('/items', async (req, res, next) => {
  const { itemName, itemStat, itemPrice } = req.body;

  if (
    typeof itemStat.health !== 'number' ||
    typeof itemStat.power !== 'number'
  ) {
    return res
      .status(404)
      .json({ message: '능력치는 숫자로만 설정할 수 있습니다.' });
  }

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

  return res.status(201).json({ data: items });
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

// 아이템 수정 API
router.put('/items/:itemCode', async (req, res, next) => {
  const { itemCode } = req.params;
  const { itemName, itemStat } = req.body;

  console.log(itemStat.health);
  if (
    typeof itemStat.health !== 'number' ||
    typeof itemStat.power !== 'number'
  ) {
    return res
      .status(404)
      .json({ message: '능력치는 숫자로만 변경할 수 있습니다.' });
  }

  const item = await prisma.items.findUnique({
    where: {
      itemCode: +itemCode,
    },
  });

  if (!item) {
    return res.status(404).json({ message: '존재하지 않는 아이템입니다.' });
  }

  await prisma.items.update({
    data: {
      itemName,
      itemStat,
    },
    where: {
      itemCode: +itemCode,
    },
  });

  return res.status(200).json({ date: '아이템이 수정되었습니다.' });
});

export default router;
