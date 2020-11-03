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
    return response.rows[0];
};

usuarioModel.login = async (conn, req) => {
    const { usuario, contrasena } = { ...req.body };
    
};

module.exports = usuarioModel;