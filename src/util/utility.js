const utility = {};

utility.addHoursToDate = (hoursParam, dateParam) => {
    return new Date(dateParam.getTime() + (hoursParam*60*60*1000));
};

module.exports = utility;