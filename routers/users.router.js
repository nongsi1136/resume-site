import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 회원가입 API
router.post('/sign-up', async (req, res, next) => {
  const { email, password, confirmPassword, name, age, gender, profileImage } =
    req.body;

  try {
    // 필수 파라미터 검증하기
    if (!email || !password || !confirmPassword || !name) {
      return res
        .status(400)
        .json({ message: '모든 필수 정보를 입력해야 합니다.' });
    }

    // 이메일 형식 검증하기
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: '유효한 이메일 주소를 입력해야 합니다.' });
    }

    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 비밀번호 해싱 : 사용자의 비밀번호를 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 이메일 중복 체크
    const existUser = await prisma.users.findUnique({ where: { email } });
    if (existUser) {
      return res
        .status(400)
        .json({ message: '이미 사용하고 있는 이메일입니다.' });
    }

    // 사용자 생성
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: { userId: true, email: true, name: true }, // 비밀번호를 제외한 사용자 정보 반환
    });

    const userInfo = await prisma.userInfos.create({
      data: {
        userId: newUser.userId,
        name,
        age,
        gender: gender.toUpperCase(),
        profileImage,
      },
    });

    return res.status(200).json({
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    next(error);
  }
});

// 로그인 API
router.post('/sign-in', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 이메일로 사용자 조회
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: '존재하지 않는 이메일입니다.' });
    }
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

    // JWT Access Token 생성
    const token = jwt.sign({ userId: user.userId }, 'custom-secret-key', {
      expiresIn: '12h',
    });

    res.cookie('authorization', `Bearer ${token}`);
    return res.status(200).json({ message: '로그인에 성공하였습니다' });
  } catch (error) {
    next(error);
  }
});

// 사용자 조회
router.get('/users', authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      userId: true,
      email: true,
      userInfos: {
        // 1:1 관계를 맺고있는 UserInfos 테이블을 조회하기.
        select: {
          name: true,
          age: true,
          gender: true,
          profileImage: true,
        },
      },
    },
  });

  return res.status(200).json({ data: user });
});

export default router;
