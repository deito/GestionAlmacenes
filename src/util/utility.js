const constantes = require('../util/constantes');
const utility = {};

utility.addHoursToDate = (hoursParam, dateParam) => {
    return new Date(dateParam.getTime() + (hoursParam*60*60*1000));
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

module.exports = utility;