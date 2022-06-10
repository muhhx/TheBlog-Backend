import { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "config";
import UserModel from "../models/user.model";
import { createJWT, verifyJWT } from "../utils/jwt";

export async function loginSessionHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  //Validate Email, password, user exists
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "Error", message: "Preencha todos os campos." });
  }

  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    return res
      .status(401)
      .json({ status: "Error", message: "Email ou senha inválido." });
  }

  if (!(await bcrypt.compare(String(password), user.password))) {
    return res
      .status(401)
      .json({ status: "Error", message: "Email ou senha inválido." });
  }

  //Verifies if user already confirmed their email
  if (!user.isEmailVerified) {
    return res.status(401).json({
      success: "Error",
      message:
        'Verifique seu email ou clique em "Confirmar meu email" para mandar novamente.',
    });
  }

  //Create JWTs
  const accessKey = config.get<string>("accessTokenPrivateKey");
  const refreshKey = config.get<string>("refreshTokenPrivateKey");

  const payload = {
    userId: user._id,
    userUsername: user.username,
    userName: user.name,
    isEmailVerified: user.isEmailVerified,
  };

  const accessToken = createJWT(payload, accessKey, "10s");
  const refreshToken = createJWT(payload, refreshKey, "20s");

  //Save refresh token to the database
  user.refreshToken = refreshToken;
  const result = await user.save();

  //Send Access and Refresh Token Cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });

  return res.status(200).json({
    status: "Ok",
    message: "Usuário logado com sucesso.",
    userName: user.name,
  });
}

export async function logoutSessionHandler(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  try {
    const user = await UserModel.findOne({ refreshToken });

    if (user) {
      user.refreshToken = "";
      const result = await user.save();
    }

    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
    });
    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ status: "Ok", message: "Logout feito com sucesso." });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Algo deu errado ao fazer o logout",
      data: error,
    });
  }
}

export function verifySessionHandler(req: Request, res: Response) {
  // @ts-ignore
  const user = req.user;

  res.status(200).json({
    status: "Ok",
    message: "O usuário está com um Token válido.",
    data: user,
  });
}

export async function refreshTokenHandler(req: Request, res: Response) {
  //1. Verificar se tem refreshToken
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ status: "Error", message: "Refresh Token não existe." });
  }

  try {
    //2. Verificar se tem user com aquele token. Só terá usuário se ele estiver logado, ai nesse caso ele poderá gerar um novo access Token para continuar no site
    const user = await UserModel.findOne({ refreshToken }).select(
      "+refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        status: "Error",
        message: "Não existe usuário com este refreshToken.",
      });
    }

    //3. Verificar se Token é valido (se ja n expirou e tals)
    const refreshKey = config.get<string>("refreshTokenPrivateKey");
    const decoded = await verifyJWT(refreshToken, refreshKey);

    if (!decoded) {
      return res.status(401).json({
        status: "Error",
        message: "Refresh Token expirado. Faça login novamente.",
      });
    }

    //4. Gerar novo token
    const accessKey = config.get<string>("accessTokenPrivateKey");

    const payload = {
      userId: user._id,
      userUsername: user.username,
      userName: user.name,
      isEmailVerified: user.isEmailVerified,
    };

    const accessToken = createJWT(payload, accessKey, "10s");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ status: "Ok", message: "Novo access token gerado com sucesso." });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Houve um erro ao verificar o refresh token.",
    });
  }
}
