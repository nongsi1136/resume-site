import express from "express";
import { prisma } from "./utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// 회원가입 API
router.post("/sign-up", async (req, res, next) => {
  const { email, password, confirmPassword, name } = req.body;

  try {
    // 비밀번호 일치 여부 확인
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // 비밀번호 해싱 : 사용자의 비밀번호를 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 이메일 중복 체크
    const existUser = await prisma.users.findUnique({ where: { email } });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "이미 사용하고 있는 이메일입니다." });
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
    return res.status(200), json({ message: "회원가입이 완료되었습니다" });
  } catch (error) {
    next(error);
  }
});

// 로그인 API
router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // 이메일로 사용자 조회
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "존재하지 않는 이메일입니다." });
    }
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

    // JWT Access Token 생성
    const token = jwt.sign({ userId: user.userId }, "custom-secret-key", {
      expiresIn: "12h",
    });

    res.cookie("authorization", `Bearer ${token}`);
    return res.status(200).json({ mesaage: "로그인에 성공하였습니다" });
  } catch (error) {
    next(error);
  }
});

export default router;
