const RolBean = require('../bean/rolBean');
const UsuarioBean = require('../bean/usuarioBean');
const LocalBean = require('../bean/localBean');
const usuarioModel = {};

usuarioModel.save = async (conn, usuarioBean) => {
    
    const response = await conn.query(
        "INSERT INTO rrn.tusuario(id_local, nombres, apellidos, usuario, contrasena, id_rol, tipo_documento, numero_documento, telefono, estado, registrado_por, fecha_registro) "+
        "VALUES($1,$2,$3,$4,crypt($5, gen_salt('bf')),$6,$7,$8,$9,$10,$11,$12) RETURNING id_usuario", 
        [ usuarioBean.localBean.id_local, usuarioBean.nombres, usuarioBean.apellidos, usuarioBean.usuario, usuarioBean.contrasena, 
            usuarioBean.rolBean.id_rol, usuarioBean.tipo_documento, usuarioBean.numero_documento, usuarioBean.telefono, usuarioBean.estado, 
            usuarioBean.registrado_por, usuarioBean.fecha_registro ]
    );
    console.log("usuarioModel.save response: ", response);
    return response.rows;
};

usuarioModel.login = async (conn, req) => {
    const { usuario, contrasena } = { ...req.body };
    const queryResponse = await conn.query("SELECT usu.*, rol.descripcion as rol_descripcion, rol.estado rol_estado,"
    +" local.codigo as local_codigo, local.nombre as local_nombre, local.telefono as local_telefono, local.direccion as local_direccion,"
    +" local.estado as local_estado, local.registrado_por as local_registrado_por, local.fecha_registro as local_fecha_registro,"
    +" local.modificado_por as local_modificado_por, local.fecha_modificacion as local_fecha_modificacion"
    +" FROM rrn.tusuario usu"
    +" left join rrn.trol rol on rol.id_rol = usu.id_rol"
    +" left join rrn.tlocal local on local.id_local = usu.id_local "
    +" where usu.usuario=$1 and usu.contrasena is not null and usu.contrasena=crypt($2,usu.contrasena)"
    ,
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

usuarioModel.getAll = async (conn) => {
    const queryResponse = await conn.query("SELECT usu.*"
    //+", rol.descripcion as rol_descripcion, rol.estado rol_estado,"
    //+" local.codigo as local_codigo, local.nombre as local_nombre, local.telefono as local_telefono, local.direccion as local_direccion,"
    //+" local.estado as local_estado, local.registrado_por as local_registrado_por, local.fecha_registro as local_fecha_registro,"
    //+" local.modificado_por as local_modificado_por, local.fecha_modificacion as local_fecha_modificacion"
    +" FROM rrn.tusuario usu"
    //+" left join rrn.trol rol on rol.id_rol = usu.id_rol"
    //+" left join rrn.tlocal local on local.id_local = usu.id_local "
    ,[]);
    const response = [];
    for(let i = 0;i < queryResponse.rows.length;i++){
        response.push(extractUsuarioFromResponse(queryResponse.rows[i]));
    }
    return response;
}

usuarioModel.updateById = async (conn, usuarioBean) => {
    const queryResponse = await conn.query("UPDATE rrn.tusuario SET id_local=$1, nombres=$2, apellidos=$3, contrasena=crypt($4,gen_salt('bf')), id_rol=$5,"
    +" tipo_documento=$6, numero_documento=$7, telefono=$8, estado=$9, modificado_por=$10, fecha_modificacion=$11 WHERE id_usuario=$12",
    [usuarioBean.local.id_local, usuarioBean.nombres, usuarioBean.apellidos, usuarioBean.contrasena, usuarioBean.rol.id_rol, 
    usuarioBean.tipo_documento , usuarioBean.numero_documento, usuarioBean.telefono, usuarioBean.estado, usuarioBean.modificado_por, 
    usuarioBean.fecha_modificacion, usuarioBean.id_usuario]);
    console.log("usuarioModel.updateById queryResponse:", queryResponse);
    if(queryResponse && queryResponse.rowCount == 1){
        return true;
    }
    return false;
};

function extractUsuarioFromResponse(aRow){
    
    const rol_descripcion = aRow.rol_descripcion ? aRow.rol_descripcion : null;
    const rol_estado = aRow.rol_estado ? aRow.rol_estado : null;
    const id_rol = aRow.id_rol ? aRow.id_rol : null;
    const rolBean = new RolBean(id_rol, rol_descripcion, rol_estado);

    const id_local = aRow.id_local ? aRow.id_local : null;
    const local_codigo = aRow.local_codigo ? aRow.local_codigo : null;
    const local_nombre = aRow.local_nombre ? aRow.local_nombre : null;
    const local_telefono = aRow.local_telefono ? aRow.local_telefono : null;
    const local_direccion = aRow.local_direccion ? aRow.local_direccion : null;
    const local_estado = aRow.local_estado ? aRow.local_estado : null;
    const local_registrado_por = aRow.local_registrado_por ? aRow.local_registrado_por : null;
    const local_fecha_registro = aRow.local_fecha_registro ? aRow.local_fecha_registro : null;
    const local_modificado_por = aRow.local_modificado_por ? aRow.local_modificado_por : null;
    const local_fecha_modificacion = aRow.local_fecha_modificacion ? aRow.local_fecha_modificacion : null;
    const localBean = new LocalBean(id_local, local_codigo, local_nombre, local_telefono, local_direccion, local_estado,
        local_registrado_por, local_fecha_registro, local_modificado_por, local_fecha_modificacion);
    
    const id_usuario = aRow.id_usuario ? aRow.id_usuario : null;
    const nombres = aRow.nombres ? aRow.nombres : null;
    const apellidos = aRow.apellidos ? aRow.apellidos : null;
    const usuario = aRow.usuario ? aRow.usuario : null;
    const contrasena = null;
    const tipo_documento = aRow.tipo_documento ? aRow.tipo_documento : null;
    const numero_documento = aRow.numero_documento ? aRow.numero_documento : null;
    const telefono = aRow.telefono ? aRow.telefono : null;
    const estado = aRow.estado ? aRow.estado : null;
    const registrado_por = aRow.registrado_por ? aRow.registrado_por : null;
    const fecha_registro = aRow.fecha_registro ? aRow.fecha_registro : null;
    const modificado_por = aRow.modificado_por ? aRow.modificado_por : null;
    const fecha_modificacion = aRow.fecha_modificacion ? aRow.fecha_modificacion : null;
    const usuarioBean = new UsuarioBean(id_usuario, localBean, nombres, apellidos, usuario, contrasena, rolBean, tipo_documento, 
        numero_documento, telefono, estado, registrado_por, fecha_registro, modificado_por, fecha_modificacion);
    return usuarioBean;
}

module.exports = usuarioModel;