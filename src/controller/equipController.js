import { EquipModel } from "../infra/database.js";

export const getAllEquip = async (req, res) => {
    try {
        const equips = await EquipModel.findAll();

        if (equips.length == 0) { 
            return res.status(200).json({
                message: "Sem equipamentos cadastrados"
            });
        };

        return res.status(200).json({ equips });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    };
};

export const getEquipId = async (req, res) => {
    const equipId = req.params.id;
    try {
        const equip = EquipModel.findOne({
            where: { id: equipId }
        });

        if (!equip) {
            return res.status(404).json({
                message: "Nenhum equipamento encontrado"
            });
        };

        return res.status(200).json({ equip });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    };
};

async function gerar_linkrtsp (usuario, senha, publico, rtsp) {
    try {
        const link_rtsp = `rtsp://${usuario}:${senha}@${publico}:${rtsp}/cam/realmonitor?channel=1&subtype=0`
        return link_rtsp;

    } catch (error) {
        console.error(error);
        return null;
    };
};

export const addEquip = async (req, res) => {
    const equipObj = req.body;

    try {
        const equipExistente = await EquipModel.findOne({
            where: { NS: equipObj.NS }
        });

        if (equipExistente) {
            return res.status(200).json({
                message: "Equipamento já existe",
                NS: equipObj.NS
            });
        };

        const link_rtsp = await gerar_linkrtsp(equipObj.usuario, equipObj.senha, equipObj.publico, equipObj.rtsp);
        
        const equipCompleto = {
            ...equipObj,
            link_rtsp: link_rtsp
        };

        const { equip_id, ...equipBanco } = equipCompleto;
        
        const equipCriado = await EquipModel.create(equipBanco);

        console.log('equipamento:', equipBanco, '\nequipCriado:', equipCriado);
        return res.status(201).json({
            message: "Equipamento criado!"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    };
};