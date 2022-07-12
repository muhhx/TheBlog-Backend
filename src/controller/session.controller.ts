import { Request, Response } from "express";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
import UserModel from "../models/user.model";
import { createJWT, verifyJWT } from "../utils/jwt";
import { getGoogleOAuthTokens, getGoogleUser } from "../utils/oauth";

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

  const accessKey = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
  const refreshKey = process.env.REFRESH_TOKEN_PRIVATE_KEY as string;

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
    const refreshKey = process.env.REFRESH_TOKEN_PRIVATE_KEY as string;
    const decoded = await verifyJWT(refreshToken, refreshKey);

    if (!decoded) {
      return res.status(401).json({
        status: "Error",
        message: "Refresh Token expirado. Faça login novamente.",
      });
    }

    //4. Gerar novo token
    const accessKey = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;

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

export async function googleOauthHandler(req: Request, res: Response) {
  const code = req.query.code as string;

  try {
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });

    const googleUser = await getGoogleUser({ id_token, access_token });

    if (!googleUser.verified_email) {
      return res.status(403).json({
        status: "Error",
        message: "Sua conta do Google não é verificada.",
      });
    }

    const user = await UserModel.findOne({ email: googleUser.email });

    const payload = {
      userId: "",
      userUsername: "",
      userName: "",
      userPicture: "",
      isEmailVerified: false,
    };

    const accessKey = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
    const refreshKey = process.env.REFRESH_TOKEN_PRIVATE_KEY as string;

    if (!user) {
      const usernameHash = crypto.randomBytes(10);
      const username = usernameHash.toString("hex");

      const encryptedPassword = await bcrypt.hash(
        crypto.randomBytes(10).toString("hex"),
        10
      );

      const createdUser = await UserModel.create({
        name: googleUser.given_name,
        username,
        bio: `Olá! Meu nome é ${googleUser.name} e esta é minha nova conta. Me siga para ler meus futuros posts!`,
        email: googleUser.email,
        password: encryptedPassword,
        picture:
          "https://firebasestorage.googleapis.com/v0/b/the-blog-565e3.appspot.com/o/visax-IqZyFphHYbw-unsplash.jpg?alt=media&token=cde739f6-671e-4d7f-b519-44fa4422caa6",
        isEmailVerified: true,
      });

      payload.userId = String(createdUser._id);
      payload.userUsername = createdUser.username;
      payload.userName = createdUser.name;
      payload.userPicture = createdUser.picture;
      payload.isEmailVerified = true;

      const accessToken = createJWT(payload, accessKey, "600s");
      const refreshToken = createJWT(payload, refreshKey, "1d");

      createdUser.refreshToken = refreshToken;
      const result = await createdUser.save();

      console.log(createdUser, payload, accessToken, refreshToken);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
    } else {
      payload.userId = String(user._id);
      payload.userUsername = user.username;
      payload.userName = user.name;
      payload.userPicture = user.picture;
      payload.isEmailVerified = true;

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
    }

    res.redirect(`${process.env.CLIENT_BASE_URL}`);
  } catch (error) {
    return res.redirect(`${process.env.CLIENT_BASE_URL}/login`);
  }
}
