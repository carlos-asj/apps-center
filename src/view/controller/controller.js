
import database from "../../infra/dbConnectPsql.js";

export const addClient = async (req, res) => {
  
  try {
    const {name, cpf_cnpj, email, tel, localization} = req.body;
  
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
        text: `INSERT INTO clients (name, cpf_cnpj, email, tel, localization)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        values: [name, cpf_cnpj, email, tel, localization]
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
};

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

export const updateClient = async (req, res) => {
  let clientId = req.params.clientId;
  const updates = req.body;

  try {
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update"
      });
    }

    const findClient = await database.query({
      text: `SELECT * FROM clients WHERE id = $1`,
      values: [clientId]
    });

    if (findClient.rowCount === 0){
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    };

    // dynamic selection of the parameters to update
    const setParams = [];
    const values = [];
    let idxParam = 1;

    if (updates.name !== undefined) {
      setParams.push(`name = $${idxParam}`);
      values.push(updates.name);
      idxParam++;
    };

    if (updates.cpf_cnpj !== undefined) {
      setParams.push(`cpf_cnpj = $${idxParam}`);
      values.push(updates.cpf_cnpj);
      idxParam++;
    };

    if (updates.email !== undefined) {
      const findEmail = await database.query({
        text: `SELECT * FROM clients WHERE email = $1`,
        values: [updates.email]
      });

      if (findEmail.rowCount != 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      };

      setParams.push(`email = $${idxParam}`);
      values.push(updates.email);
      idxParam++;
    };

    if (updates.tel !== undefined) {
      setParams.push(`tel = $${idxParam}`);
      values.push(updates.tel);
      idxParam++;
    };

    if (updates.localization !== undefined) {
      setParams.push(`localization = $${idxParam}`);
      values.push(updates.localization);
      idxParam++;
    };

    setParams.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(clientId);

    // query concatenated
    const queryTxt = `
      UPDATE clients
      SET ${setParams.join(', ')}
      WHERE id = $${idxParam}
      RETURNING *
    `;

    const putClient = await database.query({
      text: queryTxt,
      values: values
    });

    const formattedClient = await database.query({
      text: `SELECT * FROM clients WHERE id = $1`,
      values: [clientId]
    })

    return res.status(200).json({
      success: true,
      message: "Equipment updated",
      equip: formattedClient.rows[0]
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export const addEquip = async (req, res) => {
  try {
    const {description,
      serial_num,
      link_rtsp,
      mac,
      ip_local,
      ip_publico,
      login,
      password,
      http_port,
      rtsp_port,
      client_id} = req.body;

    const clientUsed = await database.query({
      text: `SELECT * FROM clients WHERE id = $1`,
      values: [client_id]
    });

    if(clientUsed.rowCount === 0) {
      return res.status(404).json({
        message: "Client not found"
      });
    };

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

    const link = await get_linkRtsp(login, password, ip_publico, rtsp_port);

    const equip = await database.query({
        text: `INSERT INTO equips (
        description,
        serial_num,
        link_rtsp,
        mac,
        ip_local,
        ip_publico,
        login,
        password,
        http_port,
        rtsp_port,
        client_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING 
          equips.id,
          equips.description,
          equips.serial_num,
          equips.link_rtsp,
          equips.mac,
          equips.ip_local,
          equips.ip_publico,
          equips.login,
          equips.password,
          equips.http_port,
          equips.rtsp_port,
          equips.client_id,
          equips.created_at,
          equips.updated_at,
          (
            SELECT row_to_json(clients) 
            FROM clients 
            WHERE clients.id = equips.client_id
          ) as client`,
        values: [description,
          serial_num,
          link,
          mac,
          ip_local,
          ip_publico,
          login,
          password,
          http_port,
          rtsp_port,
          client_id]
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
};

export const getAllEquip = async (req, res) => {
  try {
    const dbEquips = await database.query({
      text: `SELECT 
          equips.id,
          equips.description,
          equips.serial_num,
          equips.link_rtsp,
          equips.mac,
          equips.ip_local,
          equips.ip_publico,
          equips.login,
          equips.password,
          equips.http_port,
          equips.rtsp_port,
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

async function get_linkRtsp(login, password, ip_publico, rtsp_port) {
  try {
    const link_rtsp = `rtsp://${login}:${password}@${ip_publico}:${rtsp_port}/cam/realmonitor?channel=1&subtype=0`;
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
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update"
      });
    }

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

    // dynamic selection of the parameters to update
    const setParams = [];
    const values = [];
    let idxParam = 1;

    if (updates.name !== undefined) {
      setParams.push(`name = $${idxParam}`);
      values.push(updates.name);
      idxParam++;
    };

    if (updates.serial_num !== undefined) {
      setParams.push(`serial_num = $${idxParam}`);
      values.push(updates.serial_num);
      idxParam++;
    };

    if (updates.client_id !== undefined) {
      const findClient = await database.query({
        text: `SELECT * FROM clients WHERE id = $1`,
        values: [updates.client_id]
      });

      if (findClient.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Client not found"
        });
      };

      setParams.push(`client_id = $${idxParam}`);
      values.push(updates.client_id);
      idxParam++;
    };

    setParams.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(equipId);

    // query concatenated
    const queryTxt = `
      UPDATE equips
      SET ${setParams.join(', ')}
      WHERE id = $${idxParam}
      RETURNING *
    `;

    const putEquip = await database.query({
      text: queryTxt,
      values: values
    });

    const formattedEquip = await database.query({
      text: `SELECT 
          equips.id,
          equips.name,
          equips.serial_num,
          equips.created_at,
          equips.updated_at,
          json_build_object(
            'id', clients.id,
            'name', clients.name,
            'cpf_cnpj', clients.cpf_cnpj
          ) as client
        FROM equips
        JOIN clients ON clients.id = equips.client_id
        WHERE equips.id = $1
        `,
        values: [equipId]
    })

    return res.status(200).json({
      success: true,
      message: "Equipment updated",
      equip: formattedEquip.rows[0]
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