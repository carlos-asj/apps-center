import { ClientesModel } from "../infra/database.js";

export const addCliente = async (req, res) => {
  const clienteObj = req.body;

  try {
    const clienteExist = await ClientesModel.findOne({
      where: { cnpj: clienteObj.cnpj },
    });

    if (clienteExist) {
      return res.status(200).json({
        message: "Cliente já existe",
      });
    }

    const clienteCriado = await ClientesModel.create(clienteObj);

    return res.status(201).json({
      message: "Cliente criado!",
      cliente: clienteCriado,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllClientes = async (req, res) => {
  try {
    const clientes = await ClientesModel.findAll();

    res.status(200).json({ clientes });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCliente = async (req, res) => {
  const clienteId = req.params.cliente_id;
  try {
    const clienteEncontrado = await ClientesModel.findOne({
      where: { cliente_id: clienteId },
    });

    if (!clienteEncontrado) {
      return res.status(404).json({
        message: "Cliente não encontrado",
      });
    }

    return res.status(200).json({ clienteEncontrado });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
