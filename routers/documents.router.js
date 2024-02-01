import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

router.get("/resumes", async (req, res) => {
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

router.get("/resumes/:id", async (req, res, next) => {
  const { id } = req.params;

  const resume = await prisma.resumes.findUnique({
    where: { resumeId: parseInt(id) },
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
    return res.status(404).json({ errormessage: "이력서를 찾을 수 없습니다." });
  }
});

export default router;
