import { createUser } from "../../services/userServices.js";

export const createUserController = async (req, res) => {
  try {
    const userData = req.body;

    const newUser = await createUser(userData);

    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso!",
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.createdAt
      }
    });

  } catch (error) {
    if (error.message.includes("já existe")) {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }

    if (error.message.includes("deve conter") || error.message.includes("inválido")) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    })
  }
}