import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// 이력서 생성 API
router.post("/resumes", async (req, res, next) => {
  const { title, content, status = "APPLY" } = req.body;
  const { userId } = req.user;
  try {
    const resume = await prisma.resumes.create({
      data: {
        userId: +userId,
        title: title,
        content: content,
        status: status,
      },
    });
    return res.status(201).json({ data: resume });
  } catch (error) {
    next(error);
  }
});

// 모든 이력서 목록 조회 API 비즈니스 로직
router.get("/resumes", async (req, res, next) => {
  const { orderKey, orderValue } = req.query;

  const resumes = await prisma.resumes.findMany({
    select: {
      resumeId: true,
      title: true,
      content: true,
      user: {
        select: { name: true },
      },
      createdAt: true,
      status: true,
    },
    orderBy: { [orderKey]: orderValue ? orderValue.toUpperCase() : "DESC" },
  });
});

//이력서 상세 조회
router.get("/resumes/:userId", async (req, res, next) => {
  const { userId } = req.params;

  const resume = await prisma.resumes.findUnique({
    where: { resumeId: parseInt(userId) },
    select: {
      resumeId: true,
      title: true,
      content: true,
      user: {
        select: { name: true },
      },
      createdAt: true,
      status: true,
    },
  });

  if (!resume) {
    return res.status(404).json({ message: "이력서를 찾을 수 없습니다." });
  }
});

export default router;
