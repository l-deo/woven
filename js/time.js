window.addEventListener("pageshow", times);
window.addEventListener("pagehide", timesbomb);
var y = document.getElementById("y");
var w = document.getElementById("w");
var d = document.getElementById("d");
var m = document.getElementById("m");
var t = document.getElementById("t");
var s = document.getElementById("s");

/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
var weekday = new Array();
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
var month = new Array(12);
month[0] = "JANUARY";
month[1] = "FEBRUARY";
month[2] = "MARCH";
month[3] = "APRIL";
month[4] = "MAY";
month[5] = "JUNE";
month[6] = "JULY";
month[7] = "AUGUST";
month[8] = "SEPTEMBER";
month[9] = "OCTOBER";
month[10] = "NOVEMBER";
month[11] = "DECEMBER";

/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
function times() {
    setInterval(
        function () {
            y.innerHTML = new Date().getFullYear();
            w.innerHTML = weekday[new Date().getDay()];
            d.innerHTML = new Date().getDate();
            m.innerHTML = month[new Date().getMonth()];
            t.innerHTML = new Date().getHours() + ":" + new Date().getMinutes();
            s.innerHTML = new Date().getSeconds();
        }
        , 1000)
};

function timesbomb() {
    clearInterval(times);
};
