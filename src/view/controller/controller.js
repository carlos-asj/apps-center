import { Client, Equip } from "../../infra/model/index.js";
import database from "../../infra/dbConnectPsql.js";

export const addClient = async (req, res) => {
  
  try {
    const {name, cpf_cnpj} = req.body;
  
    if (!name || name.length < 3) {
      return res.status(400).json({ 
        message: "too small name",
        received: name 
      });
    }
    
    if (!cpf_cnpj || cpf_cnpj.length < 11) {
      return res.status(400).json({ 
        message: "too small cpf_cnpj",
        received: cpf_cnpj 
      });
    }
    
    try {
      const client = await Client.create({
        name: name,
        cpf_cnpj: cpf_cnpj
      });
    
      return res.status(201).json({
        success: true,
        message: "Client created!",
        client: { client }
      });
      
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error",
        client: result[0]
      });
    }
    
  } catch (error) {
    console.error('Request error:', error);
  }
};

export const getAllClients = async (req, res) => {
  try {
    const dbClients = await database.query("SELECT * FROM equips;");
    const clients = dbClients.rows;

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getClient = async (req, res) => {
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

export const addEquip = async (req, res) => {
  try {
    const {name, serial_num, client_id} = req.body;

    const client = await Client.findByPk(client_id);

    if(!client) {
      return res.status(404).json({
        message: "Client not found"
      });
    };

    const equip = await Equip.create({
      name: name.trim(),
      serial_num: serial_num.trim(),
      client_id: client_id
    });

    return res.status(201).json({
      success: true,
      message: "Equipment created",
      data: { equip }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  };
}

export const getAllEquip = async (req, res) => {
  try {
    const dbEquips = await database.query("SELECT * FROM equips ORDER BY id ASC;")
    const equips = dbEquips.rows;

    if (equips.length == 0) {
      return res.status(200).json({
        message: "None equipments found",
      });
    }

    return res.status(200).json({
      success: true,
      count: equips.length,
      data: equips
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getEquipId = async (req, res) => {
  const equipId = req.params.equip_id;
  console.log("equipId:", equipId);
  try {
    const equip = await EquipModel.findOne({
      where: { equip_id: equipId },
    });

    if (!equip) {
      return res.status(404).json({
        message: "Nenhum equipamento encontrado",
      });
    }

    return res.status(200).json({
      equipamento: equip,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

async function gerar_linkrtsp(usuario, senha, publico, rtsp) {
  try {
    const link_rtsp = `rtsp://${usuario}:${senha}@${publico}:${rtsp}/cam/realmonitor?channel=1&subtype=0`;
    return link_rtsp;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const updateEquip = async (req, res) => {
  let equip_id = req.params.equip_id;
  try {
    const equip = await EquipModel.update(req.body, {
      where: { equip_id },
    });

    const resEquip = await EquipModel.findOne({
      where: { equip_id },
    });

    return res.status(200).json({
      message: "Equipamento atualizado com sucesso",
      equipamento: resEquip.name,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteEquip = async (req, res) => {
  let equip_id = req.params.equip_id;
  try {
    const equip = await EquipModel.findOne({
      where: { equip_id: equip_id },
    });

    if (equip == null) {
      return res.status(404).json({
        message: "Equipamento não encontrado",
      });
    }

    await equip.destroy();
    return res.status(200).json({
      message: "Equipamento deletado",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const status = async (req, res) => {
  const updatedAt = new Date().toISOString();

  const dbVersionRes = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersionRes.rows[0].server_version;

  const databaseName = process.env.POSTGRES_DB;
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );

  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      }
    }
  })
}