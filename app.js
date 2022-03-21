var overlay = document.getElementById('overlay');
var btn_ShowModalButton = document.getElementById('btn_ShowModal');
var btn_CloseModal = document.getElementById('close-modal');
var btn_DecreaseFasting = document.getElementById('btn_DecreaseFasting');
var btn_IncreaseFasting = document.getElementById('btn_IncreaseFasting');
var labelFastingTime = document.getElementById('lblfastingTime');
var fastingChangeButton = document.getElementById('fastingChangeButton');
var btn_SaveSettings = document.getElementById('btnSaveSettings');
var btnSetNextEvent = document.getElementById('btnSetNextEvent');
var inpFastingStartTime = document.getElementById('inpFastingStartTime');
var outputWhatNow = document.getElementById('outputWhatNow');
var lblTimer = document.getElementById('lblTimer');
var txtPercent = document.getElementById('txtPercent');
var progressCircle = document.querySelector('.progress');
var newFastingTime = 0;
var newEatingTime = 0;
var isFastingTime = false;
var intervalEventObject = {
    fastingTime: 16,
    eatTime: 8,
    fastingStartTime: '17:00',
    theme: 'light'
};
function init() {
    load_from_LocalStorage();
}
init();
// Wenn 17:00 Fasten-Start ist: um zu ermitteln, in welchem Bereich wir uns gegenw. befinden
// Aktuelle Uhrzeit als Variable matchen mit Intervallfasten Start - Essen
// Essen = 8 Stunden -- 17:00 - 8 Stunden
// Wenn aktuelle Uhrzeit innerhalb dieser Range, isFasting auf false setzen
// Zeit runterzählen bis 17:00
// Wenn nach 17:00 Uhr und vor Essens Range, isFasting auf true setzen
// und zeit bis vor Essens Range
function checkFastingStatus() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var now = "".concat(addZero(hours), ":").concat(addZero(minutes));
    var splittedFastingTime = intervalEventObject.fastingStartTime.split(':');
    var fastingStartHour = parseInt(splittedFastingTime[0]);
    var fastingStartMinute = parseInt(splittedFastingTime[1]);
    var fastingStartTimeMinusEatTime = fastingStartHour - intervalEventObject.eatTime;
    var diffToFasting = diff("".concat(now), "".concat(intervalEventObject.fastingStartTime));
    var diffToEating = diff("".concat(now), "".concat(fastingStartTimeMinusEatTime, ":").concat(fastingStartMinute));
    var diffToFastingInPercent = ((timeStampIntoNumber(diffToFasting) * 100) /
        (intervalEventObject.eatTime * 60 * 60)).toFixed(0);
    var diffToEatingInPercent = ((timeStampIntoNumber(diffToEating) * 100) /
        (intervalEventObject.fastingTime * 60 * 60)).toFixed(0);
    var diffToFastingInSeconds = timeStampIntoNumber(diffToFasting);
    // Wenn Diff kleiner als EatingTime dann ist fasting false else fasting true
    if (diffToFastingInSeconds < intervalEventObject.eatTime * 60 * 60) {
        outputWhatNow.innerHTML = 'Jetzt: Essen';
        lblTimer.innerHTML = "".concat(diffToFasting);
        btnSetNextEvent.innerHTML = 'Fasten starten';
        txtPercent.innerHTML = "".concat(diffToFastingInPercent, "%");
        circleProgress(parseInt(diffToFastingInPercent));
        if (parseInt(diffToFastingInPercent) < 10) {
            txtPercent.style.transform = 'translateX(1.5rem)';
        }
        else {
            txtPercent.style.transform = 'translateX(0rem)';
        }
    }
    else {
        outputWhatNow.innerHTML = 'Jetzt: Fasten';
        lblTimer.innerHTML = "".concat(diffToEating);
        btnSetNextEvent.innerHTML = 'Essen starten';
        txtPercent.innerHTML = "".concat(diffToEatingInPercent, "%");
        circleProgress(parseInt(diffToEatingInPercent));
        if (parseInt(diffToEatingInPercent) < 10) {
            txtPercent.style.transform = 'translateX(1.5rem)';
        }
        else {
            txtPercent.style.transform = 'translateX(0rem)';
        }
    }
}
var radius = progressCircle.r.baseVal.value;
var circumference = radius * 2 * Math.PI;
progressCircle.style.strokeDasharray = circumference;
function circleProgress(percent) {
    progressCircle.style.strokeDashoffset =
        circumference - (percent / 100) * circumference;
}
function timeStampIntoNumber(timeStamp) {
    var splittedTimestamp = timeStamp.split(':');
    var splittedHour_inSeconds = parseInt(splittedTimestamp[0]) * 60 * 60;
    var splittedMinute_inSeconds = parseInt(splittedTimestamp[1]) * 60;
    var secondsSum = splittedHour_inSeconds + splittedMinute_inSeconds;
    // console.log('Timestamp in Sec: ', secondsSum);
    return secondsSum;
}
// Sekündlicher Funktionsaufruf für Check Func
function checkIntervall() {
    setInterval(function () {
        checkFastingStatus();
    }, 1000);
}
checkIntervall();
function addZero(val) {
    if (val < 10) {
        val = '0' + val;
    }
    return val;
}
// Diff Berechnung
function diff(start, end) {
    start = start.split(':');
    end = end.split(':');
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    if (hours < 0)
        hours = hours + 24;
    return ((hours <= 9 ? '0' : '') +
        hours +
        ':' +
        (minutes <= 9 ? '0' : '') +
        minutes);
}
// Einstellungen einblenden
btn_ShowModalButton === null || btn_ShowModalButton === void 0 ? void 0 : btn_ShowModalButton.addEventListener('click', function () {
    overlay.style.display = 'block';
    newFastingTime = intervalEventObject.fastingTime;
    newEatingTime = intervalEventObject.eatTime;
    inpFastingStartTime.value = intervalEventObject.fastingStartTime;
    displayFastingTime();
});
// Fasten Wert rauf und runter schalten
btn_IncreaseFasting === null || btn_IncreaseFasting === void 0 ? void 0 : btn_IncreaseFasting.addEventListener('click', function () {
    changeFastingTime('incre');
});
// Fasten Wert rauf und runter schalten
btn_DecreaseFasting === null || btn_DecreaseFasting === void 0 ? void 0 : btn_DecreaseFasting.addEventListener('click', function () {
    changeFastingTime('decr');
});
// Einstellungen ausblenden
btn_CloseModal === null || btn_CloseModal === void 0 ? void 0 : btn_CloseModal.addEventListener('click', function () {
    overlay.style.display = 'none';
});
// Fastenzeit ändern
function changeFastingTime(direction) {
    // Fasten verlängern
    if (direction === 'incre') {
        if (newFastingTime < 23) {
            newFastingTime++;
            newEatingTime = 24 - newFastingTime;
            displayFastingTime();
        }
        // Fasten verkürzen
    }
    else {
        if (newFastingTime > 2) {
            newFastingTime--;
            newEatingTime = 24 - newFastingTime;
            displayFastingTime();
        }
    }
}
// Einstellungen speichern
btn_SaveSettings === null || btn_SaveSettings === void 0 ? void 0 : btn_SaveSettings.addEventListener('click', function () {
    intervalEventObject.fastingTime = newFastingTime;
    intervalEventObject.eatTime = newEatingTime;
    console.log(inpFastingStartTime.value);
    intervalEventObject.fastingStartTime = inpFastingStartTime.value;
    fastingChangeButton.innerText = "".concat(intervalEventObject.fastingTime, ":").concat(intervalEventObject.eatTime);
    overlay.style.display = 'none';
    save_into_LocalStorage();
});
// Zeigt die Werte im veränderbaren Inputfeld an
function displayFastingTime() {
    labelFastingTime.value = "".concat(newFastingTime, ":").concat(newEatingTime);
}
// Event setzen
btnSetNextEvent === null || btnSetNextEvent === void 0 ? void 0 : btnSetNextEvent.addEventListener('click', function () {
    console.log('Fasten starten');
});
var save_into_LocalStorage = function () {
    localStorage.setItem('stored_IntervallObj', JSON.stringify(intervalEventObject));
    console.log('Gespeichert');
};
function load_from_LocalStorage() {
    if (localStorage.getItem('stored_IntervallObj') !== null) {
        //@ts-ignore
        intervalEventObject = JSON.parse(localStorage.getItem('stored_IntervallObj'));
        fastingChangeButton.innerText = "".concat(intervalEventObject.fastingTime, ":").concat(intervalEventObject.eatTime);
        console.log('Speicherobj befüllt', intervalEventObject);
    }
    else {
        console.warn('Keine Daten vorh');
    }
}
