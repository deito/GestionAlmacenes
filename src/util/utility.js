const bigDecimal = require('js-big-decimal');
const constantes = require('../util/constantes');
const utility = {};

utility.addHoursToDate = (hoursParam, dateParam) => {
    // 60*60*1000 = 3600000
    return new Date(dateParam.getTime() + (hoursParam*3600000));
};

utility.validateStringDateYYYYMMDD = (stringDate) => {
    // stringDate: YYYY-MM_DD
    const fecha = new Date(stringDate);
    //console.log("stringDate:", stringDate);
    //console.log("fecha:", fecha);
    //console.log("constantes.minDate:", constantes.minDate);
    //console.log("constantes.maxDate:", constantes.maxDate);
    //console.log("fecha > constantes.minDate:", fecha > constantes.minDate);
    //console.log("fecha < constantes.maxDate:", fecha < constantes.maxDate);
    return fecha > constantes.minDate && fecha < constantes.maxDate;
};

utility.isNumericValue = (paramValue) => {
    try {
        const bdVar = new bigDecimal(paramValue);
        return true;
    } catch (error) {
        console.log("Error en utility.isNumericValue,", error);
        return false;
    }
};

/* Es 'paramValue' un valor de numero entero?
* @Params: paramValue
*/
utility.isWholeNumberValue = (paramValue) => {
    try {
        const bdValue = new bigDecimal(paramValue);
        const bdCeilValue = new bigDecimal(paramValue).ceil();
        console.log("bdValue:", bdValue.getValue());
        console.log("bdCeilValue:", bdCeilValue.getValue());
        if(bdCeilValue.compareTo(bdValue) == 0){
            console.log("Sí se un valor entero");
            return true;
        } else {
            console.log("No es un valor entero");
            return false;
        }
        
    } catch (error) {
        console.log("Error en utility.isWholeNumberValue,", error);
        return false;
    }
};

utility.isLessThanOne = (paramValue) => {
    try {
        const bdValue = new bigDecimal(paramValue);
        const bdUno = new bigDecimal("1");
        if(bdUno.compareTo(bdValue) > 0){ // Si bdUno.compareTo(bdValue) = 1, entonces paramValue es menor que 1
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("Error en utility.isWholeNumberValue,", error);
        return false;
    }
};

module.exports = utility;