
import database from "../../infra/dbConnectPsql.js";

export const addClient = async (req, res) => {
  
  try {
    const {name, cpf_cnpj} = req.body;
  
    if (!cpf_cnpj){
      return res.status(400).json({
        message: "CPF or CNPJ are required"
      });
    }else if (!name || name.length < 3) {
      return res.status(400).json({ 
        message: "too small name"
      });
    } else if (!cpf_cnpj || cpf_cnpj.length < 11) {
      return res.status(400).json({ 
        message: "too small cpf_cnpj"
      });
    }

    try {
      const keyUsed = await database.query({
        text: `SELECT * FROM clients WHERE cpf_cnpj = $1`,
        values: [cpf_cnpj]
      });

      if (keyUsed.rowCount != 0) {
        return res.status(500).json({
          success: false,
          message: "Client already exist"
        });
      };

      const client = await database.query({
        text: `INSERT INTO clients (name, cpf_cnpj, created_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *`,
        values: [name, cpf_cnpj]
      });

      const clientFormated = client.rows[0];
    
      return res.status(201).json({
        success: true,
        message: "Client created!",
        client: { clientFormated }
      });
      
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error"
      });
    }
    
  } catch (error) {
    console.error('Request error:', error);
  }
};

export const getAllClients = async (req, res) => {
  try {
    const dbClients = await database.query("SELECT * FROM clients;");
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

export const deleteClient = async (req, res) => {
  let clientId = req.params.clientId;

  try {
    const findClient = await database.query({
      text: `SELECT * FROM clients WHERE id = $1`,
      values: [clientId]
    });

    if (findClient.rowCount === 0) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    await database.query({
      text: `DELETE FROM clients WHERE id = $1`,
      values: [clientId]
    });

    return res.status(200).json({
      success: true,
      message: "Client deleted"
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export const getClientId = async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const findClient = await database.query({
      text:`SELECT * FROM clients WHERE id = $1`,
      values: [clientId]
    });

    if (findClient.rowCount === 0) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const formattedClient = findClient.rows[0]

    return res.status(200).json({
      success: true,
      client: formattedClient
    });
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

    const clientUsed = await database.query({
      text: `SELECT * FROM clients WHERE id = $1`,
      values: [client_id]
    });

    const serialUsed = await database.query({
      text: `SELECT serial_num FROM equips WHERE serial_num = $1`,
      values: [serial_num]
    });

    if(serialUsed.rowCount != 0) {
      return res.status(400).json({
        success: false,
        message: "Serial number already registered"
      });
    };

    if(clientUsed.rowCount === 0) {
      return res.status(404).json({
        message: "Client not found"
      });
    };

    const equip = await database.query({
        text: `INSERT INTO equips (name, serial_num, client_id)
        VALUES ($1, $2, $3)
        RETURNING 
          equips.id,
          equips.name,
          equips.serial_num,
          equips.client_id,
          equips.created_at,
          equips.updated_at,
          (
            SELECT row_to_json(clients) 
            FROM clients 
            WHERE clients.id = equips.client_id
          ) as client`,
        values: [name, serial_num, client_id]
      });
      
    const equipFormatted = equip.rows[0];

    return res.status(201).json({
      success: true,
      message: "Equipment created",
      data: { equipFormatted }
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
    const dbEquips = await database.query({
      text: `SELECT 
          equips.id,
          equips.name,
          equips.serial_num,
          equips.created_at,
          equips.updated_at,
          json_build_object(
          'name', clients.name,
          'cpf_cnpj', clients.cpf_cnpj) as client
        FROM equips
        JOIN clients ON clients.id = equips.client_id`
    });
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
  const equipId = req.params.equipId;

  try {
    const findEquip = await database.query({
      text: `SELECT 
          equips.id,
          equips.name,
          equips.serial_num,
          equips.created_at,
          equips.updated_at,
          json_build_object(
          'name', clients.name,
          'cpf_cnpj', clients.cpf_cnpj) as client
        FROM equips
        JOIN clients ON clients.id = equips.client_id
        WHERE equips.id = $1`,
      values: [equipId]
    });

    if (findEquip.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    };

    const formattedEquip = findEquip.rows[0];

    return res.status(200).json({
      success: true,
      equipment: formattedEquip,
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
  let equipId = req.params.equipId;
  const updates = req.body;
  try {
    const findEquip = await database.query({
      text: `SELECT * FROM equips WHERE id = $1`,
      values: [equipId]
    });

    if (findEquip.rowCount === 0){
      return res.status(404).json({
        success: false,
        message: "Equipment not found"
      });
    };
    
    const {name, serial_num, client_id} = req.body;

    const putEquip = await database.query({
      text: `ALTER TABLE equips
      ALTER COLUMN name`,
      values: []
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
  let equipId = req.params.equipId;

  try {
    const findEquip = await database.query({
      text: `SELECT * FROM equips WHERE id = $1`,
      values: [equipId]
    });

    if (findEquip.rowCount === 0) {
      return res.status(404).json({
        message: "Equipment not found",
      });
    }

    await database.query({
      text: `DELETE FROM equips WHERE id = $1`,
      values: [equipId]
    });

    return res.status(200).json({
      success: true,
      message: "Equipment deleted"
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