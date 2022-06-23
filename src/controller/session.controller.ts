import { Request, Response } from "express";
import bcrypt from "bcrypt";
import config from "config";
import UserModel from "../models/user.model";
import { createJWT, verifyJWT } from "../utils/jwt";
import IUser from "../interface/user.interface";

export async function loginSessionHandler(req: Request, res: Response) {
  const { email, password } = req.body;

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

  if (!user.isEmailVerified) {
    return res.status(401).json({
      success: "Error",
      message:
        'Verifique seu email ou clique em "Confirmar meu email" para mandar novamente.',
    });
  }

  const accessKey = config.get<string>("accessTokenPrivateKey");
  const refreshKey = config.get<string>("refreshTokenPrivateKey");

  const payload = {
    userId: user._id,
    userUsername: user.username,
    userName: user.name,
    userPicture: user.picture,
    isEmailVerified: user.isEmailVerified,
  };

  const accessToken = createJWT(payload, accessKey, "600s");
  const refreshToken = createJWT(payload, refreshKey, "1d");

  user.refreshToken = refreshToken;
  const result = await user.save();

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
    userId: user._id,
    userPicture: user.picture,
    userUsername: user.username,
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

export async function verifySessionHandler(req: Request, res: Response) {
  // @ts-ignore
  const user = req.user;

  try {
    const userData: any = await UserModel.findById(user.userId);

    const filteredData = {
      userId: userData._id,
      userUsername: userData.username,
      userName: userData.name,
      userPicture: userData.picture,
      isEmailVerified: userData.isEmailVerified,
    };

    res.status(200).json({
      status: "Ok",
      message: "O usuário está com um Token válido.",
      data: filteredData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Não foi possível verificar a sessão",
      error,
    });
  }
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
      userPicture: user.picture,
      isEmailVerified: user.isEmailVerified,
    };

    const accessToken = createJWT(payload, accessKey, "600s");

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
