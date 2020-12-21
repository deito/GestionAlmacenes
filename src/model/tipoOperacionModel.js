const tipoOperacionModel = {};

tipoOperacionModel.getAll = async (conn) => {
    try {
        const queryResponse = await conn.query("SELECT tipo_operacion.* FROM rrn.ttipo_operacion tipo_operacion");
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en tipoOperacionModel.getAll,", error);
        throw error;
    }
};

module.exports = tipoOperacionModel;