import bcrypt from "bcryptjs";
import Users from "../../models/user/Users.js";

export default async function login(req, res) {
  const { email, password: inputPassword } = req.body;
  const user = await Users.findOne({ 
      email: email.toLowerCase().trim() 
    });

  if (!user) {
    return res.status(500).json({
      error: "Usuário não encontrado!"
    })
  }

  const pwd = req.body.password;
  const userData = await Users.findOne({ email: email.toLowerCase().trim() })
      .select('+password')
      .lean(); // Converte para objeto JavaScript puro

  if (!user) {
      // Simular tempo de comparação para evitar timing attacks
      await bcrypt.compare(pwd, "$2b$10$fak3h4shForTim1ngAtt4ck");
      
      return res.status(401).json({
        error: "Credenciais inválidas"
      });
    }

  const validatePwd = await bcrypt.compare(pwd, userData.password)
  
  if (!validatePwd) {
    return res.status(500).json({
      error: "Usuário ou senha inválidos"
    })
  }

  return res.status(200).json({
    success: true,
    message: "Login realizado com sucesso",
    user: user
  });
}