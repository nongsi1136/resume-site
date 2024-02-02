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

  return res.status(200).json({ data: resumes });
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

//이력서 수정 API 비즈니스 로직
router.post("/resumes/:userId", async (req, res, next) => {
  // 해당하는 이력서를 조회해야 겠징
  try {
    const resume = await prisma.resumes.findUnique({
      where: { userId: parseInt(userId) },
    });
    // 다음 이력서가 조회하질 않을 경우 없다고 반환하고
    if (!resume) {
      return res.status(404).json({ message: "이력서 조회에 실패하였습니다." });
    }
    // 본인이 작성한 이력서에 대해서만 수정이 가능하게
    if (resume.userId !== parseInt(userId)) {
      return res
        .status(401)
        .json({ message: "해당 이력서를 수정할 권한이 없습니다" });
    }
    // 이력서 수정하기
    const Updateresume = await prisma.resumes.update({
      wherte: { userId: parseInt(userId) },
      data: {
        title,
        content,
      },
    });
    return res.status(200).json({ message: { data: Updateresume } });
  } catch (error) {
    next(error);
  }
});

export default router;
