module.exports = class StockBean {
    constructor(obj){
        obj = obj || {};
        this.id_stock = obj.id_stock;
        this.producto = obj.producto;
        this.local = obj.local;
        this.cantidad = obj.cantidad;
    }
}