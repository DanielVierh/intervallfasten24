/*
Erstellungsdatum: 18.03.2022 - Daniel Vierheilig
*/
var overlay = document.getElementById('overlay');
var overlay2 = document.getElementById('overlay2');
var btn_ShowModalButton = document.getElementById('btn_ShowModal');
var btn_ShowModalButton2 = document.getElementById('btn_ShowModal2');
var btn_CloseModal = document.getElementById('close-modal');
var btn_CloseModal2 = document.getElementById('close-modal2');
var btn_DecreaseFasting = document.getElementById('btn_DecreaseFasting');
var btn_DecreaseWater = document.getElementById('btn_DecreaseWater');
var btn_IncreaseFasting = document.getElementById('btn_IncreaseFasting');
var btn_IncreaseWater = document.getElementById('btn_IncreaseWater');
var labelFastingTime = document.getElementById('lblfastingTime');
var fastingChangeButton = document.getElementById('fastingChangeButton');
var btn_SaveSettings = document.getElementById('btnSaveSettings');
var btnSetNextEvent = document.getElementById('btnSetNextEvent');
var inpFastingStartTime = document.getElementById('inpFastingStartTime');
var outputWhatNow = document.getElementById('outputWhatNow');
var lblTimer = document.getElementById('lblTimer');
var txtPercent = document.getElementById('txtPercent');
var circleTrack = document.getElementById("circleTrack");
var progressCircle = document.querySelector('.progress');
var outputFrom = document.getElementById("outputFrom");
var outputTo = document.getElementById('outputTo');
var themeStyle = document.getElementById("themeStyle");
var btnWaterUnit02 = document.getElementById("btnWaterUnit02");
var btnWaterUnit025 = document.getElementById("btnWaterUnit025");
var btnWaterUnit033 = document.getElementById("btnWaterUnit033");
var lblAddingWater = document.getElementById("lblAddingWater");
var outputTodayWater = document.getElementById("outputTodayWater");
var btnSaveWater = document.getElementById("btnSaveWater");
var waterButton = document.getElementById("waterButton");
var btnReset = document.getElementById("btnReset");
var newFastingTime = 0;
var newEatingTime = 0;
var isFastingTime = false;
var newWaterAmount = 0.2;
var intervalEventObject = {
    fastingTime: 16,
    eatTime: 8,
    fastingStartTime: '17:00',
    theme: 'light',
    water: 0
};
// Init -- Start
function init() {
    load_from_LocalStorage();
    setTheme();
    checkIntervall();
}
init();
function setTheme() {
    var body = document.body;
    body.classList.remove("lightTheme");
    body.classList.remove("darkTheme");
    lblTimer.classList.remove("lightPercentColor");
    circleTrack === null || circleTrack === void 0 ? void 0 : circleTrack.classList.remove("darkThemeRing");
    circleTrack === null || circleTrack === void 0 ? void 0 : circleTrack.classList.remove("lightThemeRing");
    if (intervalEventObject.theme === 'Dunkel') {
        body.classList.add("darkTheme");
        circleTrack === null || circleTrack === void 0 ? void 0 : circleTrack.classList.add("darkThemeRing");
    }
    else {
        body.classList.add("lightTheme");
        lblTimer.classList.add("lightPercentColor");
        circleTrack === null || circleTrack === void 0 ? void 0 : circleTrack.classList.add("lightThemeRing");
    }
}
// Funktion zur Überprüfung, ob gerade Fastenzeit läuft
// Entsprechend wird die Anzeige der UI Elemente angepasst
function checkFastingStatus() {
    var now = currentTime();
    var splittedFastingTime = intervalEventObject.fastingStartTime.split(':');
    var fastingStartHour = parseInt(splittedFastingTime[0]);
    var fastingStartMinute = parseInt(splittedFastingTime[1]);
    var fastingStartTimeMinusEatTime = fastingStartHour - intervalEventObject.eatTime;
    if (fastingStartTimeMinusEatTime < 0) {
        fastingStartTimeMinusEatTime = 24 + fastingStartTimeMinusEatTime;
    }
    var diffToFasting = diff("".concat(now), "".concat(intervalEventObject.fastingStartTime));
    var diffToEating = diff("".concat(now), "".concat(fastingStartTimeMinusEatTime, ":").concat(fastingStartMinute));
    var diffToFastingInPercent = ((timeStampIntoNumber(diffToFasting) * 100) /
        (intervalEventObject.eatTime * 60 * 60)).toFixed(1);
    var diffToEatingInPercent = ((timeStampIntoNumber(diffToEating) * 100) /
        (intervalEventObject.fastingTime * 60 * 60)).toFixed(1);
    var diffToFastingInSeconds = timeStampIntoNumber(diffToFasting);
    // Wenn Diff kleiner als EatingTime dann ist fasting = false sonst fasting = true
    if (diffToFastingInSeconds < intervalEventObject.eatTime * 60 * 60) {
        isFastingTime = false;
        outputWhatNow.innerHTML = 'Jetzt: Essen';
        lblTimer.innerHTML = "".concat(diffToFasting);
        btnSetNextEvent.innerHTML = 'Fasten starten';
        // txtPercent.innerHTML = `${diffToFastingInPercent}%`;
        outputFrom.innerHTML = "".concat(addZero(fastingStartTimeMinusEatTime), ":").concat(addZero(fastingStartMinute));
        outputTo.innerHTML = "".concat(intervalEventObject.fastingStartTime);
        circleProgress(parseInt(diffToFastingInPercent));
        // if (parseInt(diffToFastingInPercent) < 10) {
        //     txtPercent.style.transform = 'translateX(1.5rem)';
        // } else {
        //     txtPercent.style.transform = 'translateX(0rem)';
        // }
    }
    else {
        isFastingTime = true;
        outputWhatNow.innerHTML = 'Jetzt: Fasten';
        lblTimer.innerHTML = "".concat(diffToEating);
        btnSetNextEvent.innerHTML = 'Essen starten';
        // txtPercent.innerHTML = `${diffToEatingInPercent}%`;
        outputFrom.innerHTML = "".concat(intervalEventObject.fastingStartTime);
        outputTo.innerHTML = "".concat(addZero(fastingStartTimeMinusEatTime), ":").concat(addZero(fastingStartMinute));
        circleProgress(parseInt(diffToEatingInPercent));
        // if (parseInt(diffToEatingInPercent) < 10) {
        //     txtPercent.style.transform = 'translateX(1.5rem)';
        // } else {
        //     txtPercent.style.transform = 'translateX(0rem)';
        // }
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
function currentTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var now = "".concat(addZero(hours), ":").concat(addZero(minutes));
    return now;
}
// Sekündlicher Funktionsaufruf für Check Func
function checkIntervall() {
    setInterval(function () {
        checkFastingStatus();
    }, 1000);
}
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
    themeStyle.value = intervalEventObject.theme;
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
    intervalEventObject.fastingStartTime = inpFastingStartTime.value;
    intervalEventObject.theme = themeStyle.value;
    fastingChangeButton.innerText = "".concat(intervalEventObject.fastingTime, ":").concat(intervalEventObject.eatTime);
    overlay.style.display = 'none';
    save_into_LocalStorage();
    setTheme();
});
// Zeigt die Werte im veränderbaren Inputfeld an
function displayFastingTime() {
    labelFastingTime.value = "".concat(newFastingTime, ":").concat(newEatingTime);
}
// Event setzen
btnSetNextEvent === null || btnSetNextEvent === void 0 ? void 0 : btnSetNextEvent.addEventListener('click', function () {
    var nextEvent = '';
    isFastingTime ? nextEvent = 'Essen' : nextEvent = 'Fasten';
    var request = window.confirm("M\u00F6chtest du die Phase: \"".concat(nextEvent, "\" wirklich vorzeitig starten?"));
    if (request) {
        var now = currentTime();
        var splittedNow = now.split(':');
        var minuteMinus1 = parseInt(splittedNow[1]) - 1;
        if (isFastingTime === true) {
            // Berechne neue Fastenzeit now + Essenszeit
            var newFastingStartRaw = parseInt(splittedNow[0]) + intervalEventObject.eatTime;
            if (newFastingStartRaw > 24)
                newFastingStartRaw = newFastingStartRaw - 24;
            var newFastingStart = "".concat(addZero(newFastingStartRaw), ":").concat(addZero(minuteMinus1));
            intervalEventObject.fastingStartTime = newFastingStart;
        }
        else {
            // Setze jetzige Zeit als Fastenzeit
            intervalEventObject.fastingStartTime = "".concat(splittedNow[0], ":").concat(addZero(minuteMinus1));
        }
        save_into_LocalStorage();
    }
});
var save_into_LocalStorage = function () {
    localStorage.setItem('stored_IntervallObj', JSON.stringify(intervalEventObject));
};
function load_from_LocalStorage() {
    if (localStorage.getItem('stored_IntervallObj') !== null) {
        //@ts-ignore
        intervalEventObject = JSON.parse(localStorage.getItem('stored_IntervallObj'));
        fastingChangeButton.innerText = "".concat(intervalEventObject.fastingTime, ":").concat(intervalEventObject.eatTime);
        try {
            waterButton.innerText = "".concat(intervalEventObject.water.toFixed(2), " L");
        }
        catch (err) {
            console.log(err);
            intervalEventObject.water = 0;
            waterButton.innerText = "".concat(intervalEventObject.water.toFixed(2), " L");
        }
    }
    else {
        // console.warn('Keine Daten vorh');
    }
}
//################################################################################
// Heute getrunken
var waterUnit = 0.2;
// Wasserfenster einblenden
btn_ShowModalButton2 === null || btn_ShowModalButton2 === void 0 ? void 0 : btn_ShowModalButton2.addEventListener('click', function () {
    overlay2.style.display = 'block';
    outputTodayWater.innerHTML = "".concat(intervalEventObject.water.toFixed(2), " Liter");
    outputTodayWater.classList.remove("waterAnimation");
});
btnWaterUnit02 === null || btnWaterUnit02 === void 0 ? void 0 : btnWaterUnit02.addEventListener("click", function () {
    resetActiveWaterUnit();
    btnWaterUnit02.classList.add("active");
    waterUnit = 0.2;
    newWaterAmount = waterUnit;
    lblAddingWater.value = "".concat(waterUnit, " L");
});
btnWaterUnit025 === null || btnWaterUnit025 === void 0 ? void 0 : btnWaterUnit025.addEventListener("click", function () {
    resetActiveWaterUnit();
    btnWaterUnit025.classList.add("active");
    waterUnit = 0.25;
    newWaterAmount = waterUnit;
    lblAddingWater.value = "".concat(waterUnit, " L");
});
btnWaterUnit033 === null || btnWaterUnit033 === void 0 ? void 0 : btnWaterUnit033.addEventListener("click", function () {
    resetActiveWaterUnit();
    btnWaterUnit033.classList.add("active");
    waterUnit = 0.33;
    newWaterAmount = waterUnit;
    lblAddingWater.value = "".concat(waterUnit, " L");
});
// Resetfunc um alle Active Klassen zu entfernen
function resetActiveWaterUnit() {
    btnWaterUnit02.classList.remove("active");
    btnWaterUnit025.classList.remove("active");
    btnWaterUnit033.classList.remove("active");
}
// Modal 2 schließen
btn_CloseModal2 === null || btn_CloseModal2 === void 0 ? void 0 : btn_CloseModal2.addEventListener("click", function () {
    overlay2.style.display = 'none';
});
btn_IncreaseWater === null || btn_IncreaseWater === void 0 ? void 0 : btn_IncreaseWater.addEventListener("click", function () {
    (newWaterAmount += waterUnit).toFixed(2);
    lblAddingWater.value = "".concat(newWaterAmount.toFixed(2), " L");
});
// Wassermenge abziehen
btn_DecreaseWater === null || btn_DecreaseWater === void 0 ? void 0 : btn_DecreaseWater.addEventListener("click", function () {
    if (newWaterAmount > waterUnit) {
        (newWaterAmount -= waterUnit).toFixed(2);
        lblAddingWater.value = "".concat(newWaterAmount.toFixed(2), " L");
    }
    else {
        newWaterAmount = 0 - waterUnit;
        lblAddingWater.value = "".concat(newWaterAmount.toFixed(2), " L");
    }
});
// Speichere neue Wassermenge
btnSaveWater === null || btnSaveWater === void 0 ? void 0 : btnSaveWater.addEventListener("click", function () {
    intervalEventObject.water += newWaterAmount;
    if (intervalEventObject.water < 0) {
        intervalEventObject.water = 0;
    }
    save_into_LocalStorage();
    waterButton.innerText = "".concat(intervalEventObject.water.toFixed(2), " L");
    outputTodayWater.innerHTML = "".concat(intervalEventObject.water.toFixed(2), " Liter");
    outputTodayWater.classList.add("waterAnimation");
    setTimeout(function () {
        overlay2.style.display = 'none';
    }, 700);
});
// Reset Water
btnReset === null || btnReset === void 0 ? void 0 : btnReset.addEventListener("click", function () {
    if (intervalEventObject.water > 0) {
        var confirm_1 = window.confirm("Soll die getrunkene Menge von ".concat(intervalEventObject.water.toFixed(2), " L wirklich zur\u00FCckgesetzt werden?"));
        if (confirm_1) {
            intervalEventObject.water = 0;
            outputTodayWater.innerHTML = "".concat(intervalEventObject.water.toFixed(2), " Liter");
            waterButton.innerText = "".concat(intervalEventObject.water.toFixed(2), " L");
            save_into_LocalStorage();
        }
    }
});
labelFastingTime.addEventListener("click", function () {
    labelFastingTime.disabled = true;
});
lblAddingWater.addEventListener("click", function () {
    lblAddingWater.disabled = true;
});
