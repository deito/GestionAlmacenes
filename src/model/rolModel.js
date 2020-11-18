const RolBean = require('../bean/rolBean');

const rolModel = {};

rolModel.getAll = async (conn) => {
    const queryResponse = await conn.query("SELECT rol.* FROM rrn.trol rol", []);
    const response = [];
    for(let i=0;i < queryResponse.rows.length;i++){
        response.push(extractRolFromResponse(queryResponse.rows[i]));
    }
    return response;
};

function extractRolFromResponse(aRow){
    const id_rol = aRow.id_rol;
    const descripcion = aRow.descripcion;
    const estado = aRow.estado;
    const rolBean = new RolBean(id_rol, descripcion, estado);
    return rolBean;
}

module.exports = rolModel;