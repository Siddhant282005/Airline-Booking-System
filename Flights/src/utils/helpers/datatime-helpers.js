function compareTime(timeString1, timeString2) {
    let dateTime1=new Date(timeString1);
    let dateTime2=new Date(timeString2);
    return dateTime1.getTime() > dateTime2.getTime();
}

function validateFlightTimes(departureTime, arrivalTime) {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    
    // Check if departure time is before arrival time
    return departure.getTime() < arrival.getTime();
}

module.exports = {
    compareTime,
    validateFlightTimes
};