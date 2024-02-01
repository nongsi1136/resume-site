import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// 회원가입 API
router.post("/signup", async (req, res) => {
  const { email, password, confirmPassword, name } = req.body;

  // 비밀번호 일치 여부 확인
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ errormessage: "비밀번호가 일치하지 않습니다." });
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  // 이메일 중복 체크
  const existUser = await prisma.users.findUnique({ where: { email } });
  if (existUser) {
    return res
      .status(400)
      .json({ errormassage: "이미 사용하고 있는 이메일입니다." });
  }

  // 사용자 생성
  const newUser = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
    select: { id: true, email: true, name: true }, // 비밀번호를 제외한 사용자 정보 반환
  });
});

// 로그인 API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 이메일로 사용자 조회
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    return res
      .status(404)
      .json({ errormessage: "존재 하지 않는 사용자입니다." });
  }

  // 비밀번호 일치 여부 확인
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res
      .status(400)
      .json({ errormessage: "비밀번호가 일치하지 않습니다." });
  }
});

export default router;
