const RolBean = require('../bean/rolBean');
const usuarioModel = {};

usuarioModel.save = async (conn, req) => {
    let { id_local, nombres, apellidos, usuario, contrasena, id_rol, tipo_documento, numero_documento, telefono, estado, registrado_por, fecha_registro } = { ...req.body };
    console.log("id_local: "+id_local);
    if(!id_local){
        id_local = null;
    }
    console.log("nombres: "+nombres);
    if(!nombres){
        nombres = null;
    }
    console.log("apellidos: "+apellidos);
    if(!apellidos){
        apellidos = null;
    }
    console.log("usuario: "+usuario);
    if(!usuario){
        usuario = null;
    }
    console.log("contrasena: "+contrasena);
    if(!contrasena){
        contrasena = null;
    }
    console.log("id_rol: "+id_rol);
    if(!id_rol){
        id_rol = null;
    }
    console.log("tipo_documento: "+tipo_documento);
    if(!tipo_documento){
        tipo_documento = null;
    }
    console.log("numero_documento: "+numero_documento);
    if(!numero_documento){
        numero_documento = null;
    }
    console.log("telefono: "+telefono);
    if(!telefono){
        telefono = null;
    }
    console.log("estado: "+estado);
    if(!estado){
        estado = null;
    }
    console.log("registrado_por: "+registrado_por);
    if(!registrado_por){
        registrado_por = null;
    }
    console.log("fecha_registro: "+fecha_registro);
    if(!fecha_registro){
        fecha_registro = null;
    }
    const response = await conn.query(
        "INSERT INTO rrn.tusuario(id_local, nombres, apellidos, usuario, contrasena, id_rol, tipo_documento, numero_documento, telefono, estado, registrado_por, fecha_registro) "+
        "VALUES($1,$2,$3,$4,crypt($5, gen_salt('bf')),$6,$7,$8,$9,$10,$11,$12) RETURNING id_usuario", 
        [ id_local, nombres, apellidos, usuario, contrasena, id_rol, tipo_documento, numero_documento, telefono, estado, registrado_por, fecha_registro ]
    );
    console.log("usuarioModel.save response: ", response);
    return response.rows;
};

usuarioModel.login = async (conn, req) => {
    const { usuario, contrasena } = { ...req.body };
    const queryResponse = await conn.query("SELECT usu.*, rol.descripcion as descripcion, rol.estado rol_estado FROM rrn.tusuario usu join rrn.trol rol on rol.id_rol = usu.id_rol where usu.usuario=$1 and usu.contrasena is not null and usu.contrasena=crypt($2,usu.contrasena)",
        [usuario, contrasena]
    );
    //console.log("queryResponse:",queryResponse);
    const response = [];
    for(let i = 0;i < queryResponse.rows.length;i++){
        response.push(extractUsuarioFromResponse(queryResponse.rows[i]));
    }
    //console.log("usuarioModel.login response: ",response);
    return response;
};

usuarioModel.getByUsuario = async (conn, usuarioParam) => {
    const queryResponse = await conn.query("SELECT * FROM rrn.tusuario WHERE usuario=$1",[usuarioParam]);
    return queryResponse.rows;
};

function extractUsuarioFromResponse(aRow){
    /*
    const rol = {
        id_rol: aRow.id_rol,
        descripcion: aRow.descripcion,
        estado: aRow.rol_estado
    };*/
    const rol = new RolBean(aRow.id_rol, aRow.descripcion, aRow.rol_estado);
    const usuario = {
        id_usuario: aRow.id_usuario,
        id_local: aRow.id_local,
        nombres: aRow.nombres,
        apellidos: aRow.apellidos,
        usuario: aRow.usuario,
        //contrasena: aRow.contrasena,
        rol: rol,
        tipo_documento: aRow.tipo_documento,
        numero_documento: aRow.numero_documento,
        telefono: aRow.telefono,
        estado: aRow.estado,
        registrado_por: aRow.registrado_por,
        fecha_registro: aRow.fecha_registro,
        modificado_por: aRow.modificado_por,
        fecha_modificacion: aRow.fecha_modificacion
    };
    return usuario;
}

module.exports = usuarioModel;