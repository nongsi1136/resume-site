import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// 이력서 생성 API
router.post('/resumes', authMiddleware, async (req, res, next) => {
  const { title, content, status = 'APPLY' } = req.body;
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
router.get('/resumes', async (req, res, next) => {
  const { orderKey, orderValue } = req.query;
  // 정렬 키와 값의 유효성 검사
  const vaildOrderKeys = [
    'resumeId',
    'title',
    'content',
    'createdAt',
    'status',
  ];
  const vaildOrderVaules = ['asc', 'desc'];

  if (
    !vaildOrderKeys.includes(orderKey) ||
    !vaildOrderVaules.includes(orderValue)
  ) {
    return res
      .status(400)
      .json({ message: '유효하지 않은 Key와 vaule 입니다.' });
  }

  // 문자열을 모두 소문자로 변환해야함.
  const changelcOrderValue = orderValue.toLowerCase();

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
    orderBy: { [orderKey]: changelcOrderValue },
  });

  return res.status(200).json({ data: resumes });
});

//이력서 상세 조회
router.get('/resumes/:resumeId', async (req, res, next) => {
  const { userId } = req.params;

  try {
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
      return res.status(404).json({ message: '이력서를 찾을 수 없습니다.' });
    }
    return res.status(200).json({ data: resume });
  } catch (error) {
    next(error);
  }
});

//이력서 수정 API 비즈니스 로직
router.patch('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { resumeId } = req.params;
  const { title, content } = req.body;
  // 해당하는 이력서를 조회해야 겠징
  try {
    const resume = await prisma.resumes.findUnique({
      where: { resumeId: parseInt(resumeId) },
    });
    // 다음 이력서가 조회하질 않을 경우 없다고 반환하고
    if (!resume) {
      return res.status(404).json({ message: '이력서 조회에 실패하였습니다.' });
    }
    // 본인이 작성한 이력서에 대해서만 수정이 가능하게
    if (resume.userId !== parseInt(userId)) {
      return res
        .status(401)
        .json({ message: '해당 이력서를 수정할 권한이 없습니다' });
    }
    // 이력서 수정하기
    const updateResume = await prisma.resumes.update({
      wherte: { resumeId: parseInt(resumeId) },
      data: {
        title,
        content,
      },
    });
    return res.status(200).json({ data: updateResume });
  } catch (error) {
    next(error);
  }
});

// 이력서 삭제 API
router.delete('/resumes/:resumeId', authMiddleware, async (req, res, next) => {
  const { resumeId } = req.params;

  const resume = await prisma.resumes.findById(resumeId).exec();
  if (!resume) {
    return res.status(401).json({ message: '이력서 조회에 실패하였습니다.' });
  }
  //이력서 삭제 권한
  if (resume.userId !== parseInt(userId)) {
    return res
      .status(401)
      .json({ message: '해당 이력서를 삭제할 권한이 없습니다' });
  }
  await resume.deleteOne({ _id: resumeId }).exec();

  return res.status(200).json({ message: '이력서 삭제 완료!' });
});

export default router;
