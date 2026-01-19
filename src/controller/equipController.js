import { EquipModel } from "../infra/database.js";

export const getAllEquip = async (req, res) => {
    try {
        const equips = await EquipModel.findAll();

        if (equips.length == 0) { 
            return res.status(200).json({
                message: "Equipamentos não encontrados"
            });
        };

        return res.status(200).json({equips});
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    };
};