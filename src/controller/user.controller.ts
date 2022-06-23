import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import config from "config";
import UserModel from "../models/user.model";
import { findUserWithoutPassword } from "../db";
import { htmlMail, sendMail } from "../utils/email";

export async function registerUserHandler(req: Request, res: Response) {
  const { name, email, emailConfirmation, password, passwordConfirmation } =
    req.body;

  //1. Data validation
  if (
    !name ||
    !email ||
    !emailConfirmation ||
    !password ||
    !passwordConfirmation
  ) {
    return res
      .status(400)
      .json({ status: "Error", message: "Preencha todos os campos." });
  }
  if (name.length < 1 || name.length > 30) {
    return res.status(400).json({
      status: "Error",
      message: "O nome precisa conter entre 1 e 30 caracteres",
    });
  }
  if (!/^[a-zA-Z_]+( [a-zA-Z_]+)*$/.test(name)) {
    return res
      .status(400)
      .json({ status: "Error", message: "O nome é inválido." });
  }
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/.test(password)
  ) {
    return res
      .status(400)
      .json({ status: "Error", message: "A senha é invállida!" });
  }
  if (email !== emailConfirmation) {
    return res
      .status(400)
      .json({ status: "Error", message: "Os emails não são iguais." });
  }
  if (password !== passwordConfirmation) {
    return res
      .status(400)
      .json({ status: "Error", message: "As senhas não são iguais." });
  }

  //2. Encrypt password
  const salt = config.get<number>("bcryptSalt");
  const encryptedPassword = await bcrypt.hash(String(password), salt);

  //3. Generate random username based on the Name provided
  const usernameHash = crypto.randomBytes(10);
  const username = usernameHash.toString("hex");

  //3. Save to the database
  try {
    const createdUser = await UserModel.create({
      name,
      username,
      bio: `Olá! Meu nome é ${name} e esta é minha nova conta. Me siga para ler meus futuros posts!`,
      email,
      password: encryptedPassword,
      picture:
        "https://firebasestorage.googleapis.com/v0/b/the-blog-565e3.appspot.com/o/visax-IqZyFphHYbw-unsplash.jpg?alt=media&token=cde739f6-671e-4d7f-b519-44fa4422caa6",
    });
    return res
      .status(201)
      .json({ status: "Ok", data: "Usuário criado com sucesso." });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message:
        "Não foi possível criar sua conta, verifique se o email ja não está sendo usado.",
      error,
    });
  }
}

export async function getUserHandler(req: Request, res: Response) {
  const { username } = req.params;

  try {
    const user = await UserModel.find(
      { username: { $eq: username } },
      {
        isEmailVerified: 0,
        confirmEmailExpire: 0,
        confirmEmailToken: 0,
        resetPasswordExpire: 0,
        resetPasswordToken: 0,
        __v: 0,
      }
    );

    if (!user) {
      return res.status(404).json({
        status: "Error",
        message: "Usuário não existe ou não pode ser encontrado.",
      });
    }

    return res.status(200).json({ status: "Ok", data: user[0] });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Não foi possível encontrar este usuário.",
    });
  }
}

export async function deleteUserHandler(req: Request, res: Response) {
  // @ts-ignore
  const { userId } = req.user;
  const { password } = req.body;

  if (!password) {
    return res
      .status(400)
      .json({ status: "Error", message: "Informe sua senha." });
  }

  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    return res.status(404).json({
      status: "Error",
      message: "Não foi possível deletar o usuário.",
    });
  }

  try {
    if (!(await bcrypt.compare(String(password), user.password))) {
      return res
        .status(401)
        .json({ status: "Error", message: "Senha inválida." });
    }

    const response = await UserModel.findByIdAndDelete(userId);

    if (!response) {
      return res.status(400).json({
        status: "Error",
        message: "Não foi possível deletar o usuário.",
      });
    }

    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
    });

    res
      .status(200)
      .json({ status: "Ok", message: "Usuário foi deletado.", reload: true });
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      message: "Não foi possível deletar o usuário.",
    });
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  // @ts-ignore
  const { userId } = req.user;
  const { name, username, bio, picture } = req.body;

  if (!name && !username && !bio && !picture) {
    return res
      .status(401)
      .json({ status: "Error", message: "Preencha pelo menos um campo." });
  }
  if (name && name.length > 30) {
    return res
      .status(401)
      .json({ status: "Error", message: "Informe um nome válido." });
  }
  if (name && !/^[a-zA-Z_]+( [a-zA-Z_]+)*$/.test(name)) {
    return res
      .status(401)
      .json({ status: "Error", message: "Informe um nome válido." });
  }
  if (bio && bio.length > 140) {
    return res
      .status(401)
      .json({ status: "Error", message: "Informe uma bio válida." });
  }
  if (username && !/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{3,29}$/.test(username)) {
    return res.status(401).json({
      status: "Error",
      message: "O username não é valido.",
    });
  }

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(500).json({
        status: "Error",
        message: "Algo deu errado ao atualizar o usuário.",
      });
    }

    await UserModel.findByIdAndUpdate(userId, {
      name,
      username,
      bio,
      picture,
    });

    return res
      .status(200)
      .json({ status: "Ok", newUserData: { name, username, bio, picture } });
  } catch (error) {
    return res.status(500).json({ status: "Error", state: "Algo deu errado." });
  }
}

export async function updatePasswordHandler(req: Request, res: Response) {
  // @ts-ignore
  const { userId } = req.user;
  const { password, passwordConfirmation } = req.body;

  //Validar senhas
  if (!password && !passwordConfirmation) {
    return res
      .status(401)
      .json({ status: "Error", message: "Preencha todos os campos" });
  }
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/.test(password)
  ) {
    return res.status(401).json({
      status: "Error",
      message: "A senha é inválida.",
    });
  }
  if (password !== passwordConfirmation) {
    return res
      .status(401)
      .json({ status: "Error", message: "As senhas precisam ser iguais" });
  }

  try {
    const user = await UserModel.findById(userId).select("+password");

    if (!user) {
      return res
        .status(500)
        .json({ status: "Error", message: "Algo deu errado" });
    }

    const isDifferentFromPreviousPassword = await bcrypt.compare(
      String(password),
      user.password
    );

    if (isDifferentFromPreviousPassword) {
      return res.status(401).json({
        status: "Error",
        message: "A senha nova deve ser diferente da anterior.",
      });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    await UserModel.findByIdAndUpdate(user.id, {
      password: hashedPassword,
    });

    return res.status(200).json({
      status: "Ok",
      message: "Senha atualizada com sucesso.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "Error", message: "Algo deu errado" });
  }
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });

  //1. Verification
  if (!email) {
    return res
      .status(401)
      .json({ status: "Error", message: "Informe um email." });
  }
  if (!user) {
    return res
      .status(400)
      .json({ status: "Error", message: "O email informado é inválido." });
  }
  if (user.resetPasswordToken && user.resetPasswordExpire > Date.now()) {
    return res.status(400).json({
      status: "Error",
      message:
        "Email já foi enviado, espere 3 minutos para enviar um novo email.",
    });
  }

  try {
    //2. Create tokens
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetExpire = Date.now() + 3 * (60 * 1000);

    await UserModel.findByIdAndUpdate(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpire: resetExpire,
    });

    //3. Send email
    const html = htmlMail("resetpassword", resetToken);

    const response = sendMail({
      to: email,
      subject: "Reset Password",
      html,
    });

    if (!response) {
      await UserModel.findByIdAndUpdate(user.id, {
        resetPasswordToken: null,
        resetPasswordExpire: null,
      });

      return res
        .status(500)
        .json({ status: "Error", message: "Email não pode ser enviado." });
    }

    return res
      .status(200)
      .json({ status: "Ok", message: "Verifique sua caixa de entrada." });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Algo deu errado, tente novamente mais tarde.",
    });
  }
}

export async function resetPassowrdHandler(req: Request, res: Response) {
  const { resetToken } = req.params;
  const { password, passwordConfirmation } = req.body;

  const user = await UserModel.findOne({
    resetPasswordToken: resetToken,
  }).select("+password");

  if (!user) {
    return res
      .status(404)
      .json({ status: "Error", message: "Token inválido." });
  }
  if (user.resetPasswordExpire < Date.now()) {
    return res
      .status(404)
      .json({ status: "Error", message: "Token expirado." });
  }

  if (!password || !passwordConfirmation) {
    return res
      .status(401)
      .json({ status: "Error", message: "Preencha todos os campos." });
  }
  if (password.length < 6) {
    return res.status(401).json({
      status: "Error",
      message: "A senha precisa ter no mínimo 6 caracteres.",
    });
  }
  if (password !== passwordConfirmation) {
    return res
      .status(401)
      .json({ status: "Error", message: "As senhas precisam ser iguais." });
  }

  try {
    if (await bcrypt.compare(String(password), user.password)) {
      return res.status(401).json({
        status: "Error",
        message: "A senha nova deve ser diferente da anterior.",
      });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    await UserModel.findByIdAndUpdate(user.id, {
      password: hashedPassword,
      resetPasswordExpire: null,
      resetPasswordToken: null,
    });

    return res.status(200).json({
      status: "Ok",
      message: "Senha atualizada com sucesso, faça o login para continuar.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Não foi possível mudar sua senha, tente novamente mais tarde.",
    });
  }
}

export async function confirmEmailHandler(req: Request, res: Response) {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });

  //1. Validation (!email, email exists, email is already validated)
  if (!email) {
    return res
      .status(400)
      .json({ status: "Error", message: "Informe um email." });
  }
  if (!user) {
    return res
      .status(400)
      .json({ status: "Error", message: "Email informado não existe." });
  }
  if (user.isEmailVerified) {
    return res
      .status(400)
      .json({ status: "Error", message: "Email já foi confirmado." });
  }
  if (user.confirmEmailToken && user.confirmEmailExpire > Date.now()) {
    return res.status(400).json({
      status: "Error",
      message:
        "Email já foi enviado, espere 3 minutos para enviar um novo email.",
    });
  }

  //2. Create tokens (confirmEmailToken, confirmEmailExpires)
  const confirmEmailToken = crypto.randomBytes(20).toString("hex");
  const confirmEmailExpire = Date.now() + 3 * (60 * 1000);

  try {
    //3. Save them to the database
    await UserModel.findByIdAndUpdate(user.id, {
      confirmEmailToken,
      confirmEmailExpire,
    });

    //4. Send email
    const html = htmlMail("confirmemail", confirmEmailToken);
    const response = sendMail({ to: email, subject: "Confirm Email", html });

    if (!response) {
      await UserModel.findByIdAndUpdate(user.id, {
        confirmEmailToken: null,
        confirmEmailExpire: null,
      });

      return res.status(500).json({
        status: "Error",
        message: "Não foi possível mandar o email de confirmação",
      });
    }

    return res.status(200).json({
      status: "Ok",
      message: `Email enviado com sucesso para ${email}.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Não foi possível mandar o email de confirmação",
    });
  }
}

export async function validateEmailHandler(req: Request, res: Response) {
  const { confirmToken } = req.params;

  const user = await UserModel.findOne({ confirmEmailToken: confirmToken });

  if (!user) {
    return res
      .status(400)
      .json({ status: "Error", message: "Token inválido." });
  }
  if (user.confirmEmailExpire < Date.now()) {
    return res
      .status(400)
      .json({ status: "Error", message: "Token expirado." });
  }

  try {
    await UserModel.findByIdAndUpdate(user.id, {
      isEmailVerified: true,
      confirmEmailToken: null,
      confirmEmailExpire: null,
    });

    return res.status(200).json({
      status: "Ok",
      message: "Email confirmado com sucesso. Faça login para continuar.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      message: "Não foi possível confirmar seu email.",
    });
  }
}
