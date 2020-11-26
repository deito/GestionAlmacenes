module.exports = class ProductoBean {
    constructor(id_producto, codigo, nombre, marca, talla, color, precio_venta, estado,
        registrado_por, fecha_registro, modificado_por, fecha_modificacion){
        this.id_producto = id_producto;
        this.codigo = codigo;
        this.nombre = nombre;
        this.marca = marca;
        this.talla = talla;
        this.color = color;
        this.precio_venta = precio_venta;
        this.estado = estado;
        this.registrado_por = registrado_por;
        this.fecha_registro = fecha_registro;
        this.modificado_por = modificado_por;
        this.fecha_modificacion = fecha_modificacion;
    }
}