function getCurrentDate(current_time){
  var month=(current_time.getMonth()+1).toString().length==1 ? '0'+(current_time.getMonth()+1).toString() : (current_time.getMonth()+1).toString() ;
  var date=current_time.getDate().toString().length==1 ? '0'+current_time.getDate().toString() :current_time.getDate().toString();
  var yyyy_mm_dd=current_time.getFullYear().toString()+'-'+month+'-'+date;
  return yyyy_mm_dd;
}
function getCurrentTime(current_time){
    var getHours=current_time.getHours().toString();
    var hours=getHours.length==1 ? '0'+getHours : getHours;
    var getMinutes=current_time.getMinutes().toString();
    var minutes=getMinutes.length==1 ? '0'+getMinutes : getMinutes;
    var hh_mm=hours+':'+minutes;
  return hh_mm;
}
module.exports = {
  currentDate: getCurrentDate,
  currentTime: getCurrentTime
}