window.addEventListener("pageshow", times);
window.addEventListener("pagehide", timesbomb);

/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
function pad(num) {
    return num < 10 ? "0" + num : num;
  }

/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
var clockTime = document.getElementById("clock_time");
var clockHours = document.getElementById("clock_hours");
var clockSeconds = document.getElementById("clock_seconds");
var calendarMonth = document.getElementById("calendar_month");
var calendarYear = document.getElementById("calendar_year");
var calendarDays = document.getElementById("calendar_days");
var calendarToday = document.getElementById("calendar_today");
var calendarWeekday = document.getElementById("calendar_weekday");
var yearProgress = document.getElementById("year_progress");
var calendarHeader = document.getElementById("calendar_header");
var viewDate = new Date();
var followToday = true;
var touchStartX = 0;
var touchStartY = 0;

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
function setViewDate(date, shouldFollow) {
    viewDate = new Date(date.getFullYear(), date.getMonth(), 1);
    if (typeof shouldFollow === "boolean") {
        followToday = shouldFollow;
    }
    renderCalendar(viewDate);
}

function shiftMonth(delta) {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1);
    followToday = false;
    renderCalendar(viewDate);
}

function shiftYear(delta) {
    viewDate = new Date(viewDate.getFullYear() + delta, viewDate.getMonth(), 1);
    followToday = false;
    renderCalendar(viewDate);
}

function renderCalendar(date) {
    var year = date.getFullYear();
    var monthIndex = date.getMonth();
    var firstDay = new Date(year, monthIndex, 1);
    var startDay = (firstDay.getDay() + 6) % 7;
    var daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    var prevMonthDays = new Date(year, monthIndex, 0).getDate();
    var today = new Date();
    var todayKey = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();

    calendarMonth.innerHTML = month[monthIndex];
    calendarYear.innerHTML = year;
    calendarDays.innerHTML = "";

    for (var i = startDay - 1; i >= 0; i--) {
        var dayValue = prevMonthDays - i;
        calendarDays.appendChild(buildDay(dayValue, "outside"));
    }

    for (var day = 1; day <= daysInMonth; day++) {
        var dateKey = year + "-" + monthIndex + "-" + day;
        var className = "";
        var dayOfWeek = (startDay + day - 1) % 7;
        if (dayOfWeek === 5 || dayOfWeek === 6) {
            className = "weekend";
        }
        if (dateKey === todayKey) {
            className = (className ? className + " " : "") + "today";
        }
        calendarDays.appendChild(buildDay(day, className));
    }

    var filled = startDay + daysInMonth;
    var nextDay = 1;
    while (filled % 7 !== 0) {
        calendarDays.appendChild(buildDay(nextDay, "outside"));
        nextDay += 1;
        filled += 1;
    }

    if (calendarToday) {
        calendarToday.innerHTML = "<span>" + month[today.getMonth()].slice(0, 3) + "</span><span>" + today.getDate() + "th</span>";
    }
    if (calendarWeekday) {
        calendarWeekday.innerHTML = weekday[today.getDay()].toUpperCase();
    }

    if (yearProgress) {
        var startOfYear = new Date(today.getFullYear(), 0, 1);
        var dayOfYear = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
        yearProgress.innerHTML = "Day " + dayOfYear + " of the year";
    }
}

function buildDay(value, className) {
    var cell = document.createElement("div");
    cell.className = "calendar_day" + (className ? " " + className : "");
    cell.textContent = pad(value);
    return cell;
}

calendarHeader.addEventListener("wheel", function (event) {
    if (event.deltaY === 0) {
        return;
    }
    event.preventDefault();
    if (event.shiftKey) {
        shiftYear(event.deltaY > 0 ? 1 : -1);
        return;
    }
    shiftMonth(event.deltaY > 0 ? 1 : -1);
}, { passive: false });

calendarHeader.addEventListener("click", function () {
    setViewDate(new Date(), true);
});

calendarHeader.addEventListener("touchstart", function (event) {
    if (!event.touches || !event.touches.length) {
        return;
    }
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, { passive: true });

calendarHeader.addEventListener("touchend", function (event) {
    if (!event.changedTouches || !event.changedTouches.length) {
        return;
    }
    var deltaX = event.changedTouches[0].clientX - touchStartX;
    var deltaY = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < 30) {
        return;
    }
    shiftMonth(deltaX < 0 ? 1 : -1);
});

/* ——————————————————————————————————————————分割线———————————————————————————————————————————————————— */
function times() {
    setInterval(
        function () {
            var now = new Date();
            if (clockHours && clockSeconds) {
                clockHours.innerHTML = pad(now.getHours()) + ":" + pad(now.getMinutes());
                clockSeconds.innerHTML = pad(now.getSeconds());
            } else {
                clockTime.innerHTML = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
            }
            if (followToday) {
                viewDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }

            renderCalendar(viewDate);
        }
        , 1000)
};

function timesbomb() {
    clearInterval(times);
};
