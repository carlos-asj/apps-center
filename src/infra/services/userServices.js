import Users from "../models/user/Users.js";
import hashPassword from "../hash.js";

export const createUser = async (userData) => {
  const {name, email, password} = userData;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("E-mail inválido");
  }

  if (!password || password.length < 6) {
    throw new Error("Senha deve conter pelo menos 6 dígitos")
  }

  const emailValidation = await Users.findOne({ email });
  if (emailValidation) {
    throw new Error("E-mail já existe")
  }

  const pwdHash = await hashPassword(password);

  const user = await Users.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: pwdHash
  });

  const userRes = user.toObject();
  delete userRes.password;

  return userRes;
}