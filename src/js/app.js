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
var btn_start_stop_longFasting = document.getElementById('btn_start_stop_longFasting');
var labelFastingTime = document.getElementById('lblfastingTime');
var fastingChangeButton = document.getElementById('fastingChangeButton');
var btn_SaveSettings = document.getElementById('btnSaveSettings');
var btnSetNextEvent = document.getElementById('btnSetNextEvent');
var inpFastingStartTime = document.getElementById('inpFastingStartTime');
var outputWhatNow = document.getElementById('outputWhatNow');
var lblTimer = document.getElementById('lblTimer');
var txtPercent = document.getElementById('txtPercent');
var circleTrack = document.getElementById('circleTrack');
var progressCircle = document.querySelector('.progress');
var outputFrom = document.getElementById('outputFrom');
var outputTo = document.getElementById('outputTo');
var themeStyle = document.getElementById('themeStyle');
var btnWaterUnit02 = document.getElementById('btnWaterUnit02');
var btnWaterUnit025 = document.getElementById('btnWaterUnit025');
var btnWaterUnit033 = document.getElementById('btnWaterUnit033');
var modal_longtimeFasting = document.getElementById('modal_longtimeFasting');
var lbl_longtimeFastingTime = document.getElementById('lbl_longtimeFastingTime');
var lblAddingWater = document.getElementById('lblAddingWater');
var outputTodayWater = document.getElementById('outputTodayWater');
var btnSaveWater = document.getElementById('btnSaveWater');
var waterButton = document.getElementById('waterButton');
var btnReset = document.getElementById('btnReset');
var lblLastWater = document.getElementById('lblLastWater');
var newFastingTime = 0;
var newEatingTime = 0;
var isFastingTime = false;
var newWaterAmount = 0.2;
var lastWater = '-';
var finishedFasting = [0, 0, 0, 0, 0, 0, 0];
var checkInterv_5Sec = 0;
var lastIdentifier = '';
var identifierObjStr = '';
var is_longtime_fasting = false;
var intervalEventObject = {
    fastingTime: 16,
    eatTime: 8,
    fastingStartTime: '17:00',
    theme: 'light',
    water: 0,
    lastWater: '-',
    finishedFasting: [0, 0, 0, 0, 0, 0, 0],
    lastIdentifier: '',
    identifierObjStr: identifierObjStr,
    longTimeFastingStart: ''
};
var FastingIdentifier = /** @class */ (function () {
    function FastingIdentifier(id, fastingTime, approxFastingStartTime) {
        this.id = id;
        this.fastingTime = fastingTime;
        this.approxFastingStartTime = approxFastingStartTime;
    }
    return FastingIdentifier;
}());
var identifierObj = new FastingIdentifier('', 0, '');
// Init -- Start
function init() {
    load_from_LocalStorage();
    setTheme();
    checkIntervall();
}
init();
//#########################################################################
// View
//#########################################################################
function setTheme() {
    var body = document.body;
    body.classList.remove('lightTheme');
    body.classList.remove('darkTheme');
    lblTimer.classList.remove('lightPercentColor');
    circleTrack === null || circleTrack === void 0 ? void 0 : circleTrack.classList.remove('darkThemeRing');
    circleTrack === null || circleTrack === void 0 ? void 0 : circleTrack.classList.remove('lightThemeRing');
    btn_ShowModalButton === null || btn_ShowModalButton === void 0 ? void 0 : btn_ShowModalButton.classList.remove("smallButton-dark");
    btn_ShowModalButton2 === null || btn_ShowModalButton2 === void 0 ? void 0 : btn_ShowModalButton2.classList.remove("smallButton-dark");
    if (intervalEventObject.theme === 'Dunkel') {
        body.classList.add('darkTheme');
        circleTrack === null || circleTrack === void 0 ? void 0 : circleTrack.classList.add('darkThemeRing');
        btn_ShowModalButton === null || btn_ShowModalButton === void 0 ? void 0 : btn_ShowModalButton.classList.add("smallButton-dark");
        btn_ShowModalButton2 === null || btn_ShowModalButton2 === void 0 ? void 0 : btn_ShowModalButton2.classList.add("smallButton-dark");
    }
    else {
        body.classList.add('lightTheme');
        lblTimer.classList.add('lightPercentColor');
        circleTrack === null || circleTrack === void 0 ? void 0 : circleTrack.classList.add('lightThemeRing');
    }
}
// Eventlistener um zu prüfen, ob man runterscrollt.
// Wenn ja, Label "Jetzt: Essen oder Fasten" kleiner machen
window.addEventListener("scroll", function () {
    var scrollHeigth = Math.floor(window.pageYOffset);
    if (scrollHeigth > 0) {
        outputWhatNow.classList.add("smallerTitle");
        console.log('Größer');
    }
    else {
        outputWhatNow.classList.remove("smallerTitle");
        console.log('Kleiner');
    }
    console.log(scrollHeigth);
});
//#########################################################################
// Funktion zur Überprüfung, ob gerade Fastenzeit läuft
// Entsprechend wird die Anzeige der UI Elemente angepasst
//#########################################################################
function checkFastingStatus() {
    // Es wird alle 10 Sekunden die ...
    checkInterv_5Sec < 5 ? checkInterv_5Sec++ : initIdentifier();
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
    }
    //* longtime fasting label update
    try {
        if (is_longtime_fasting) {
            var nowStamp = new Date();
            var startStampStr = intervalEventObject.longTimeFastingStart;
            var startStamp = new Date(startStampStr);
            var longtimefastingdiff = minutesDiff(nowStamp, startStamp);
            lbl_longtimeFastingTime.innerHTML = longtimefastingdiff;
        }
    }
    catch (error) {
    }
}
function minutesDiff(dateTimeValue2, dateTimeValue1) {
    var differenceValue = (dateTimeValue2.getTime() - dateTimeValue1.getTime()) / 1000;
    differenceValue /= 60;
    var rawMinuteTime = Math.abs(Math.round(differenceValue));
    var days = Math.floor(rawMinuteTime / (24 * 60));
    var remainingMinutes = rawMinuteTime % (24 * 60);
    var hours = Math.floor(remainingMinutes / 60);
    var minutes = remainingMinutes % 60;
    var time = "Tage: ".concat(add_zero(days), " \n Stunden: ").concat(add_zero(hours), " \n Minuten: ").concat(add_zero(minutes));
    return time;
}
function add_zero(val) {
    var returnVal = '';
    if (val < 10) {
        returnVal = "0".concat(val);
    }
    else {
        returnVal = String(val);
    }
    return returnVal;
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
        if (newFastingTime > 13) {
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
    isFastingTime ? (nextEvent = 'Essen') : (nextEvent = 'Fasten');
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
//################################################################################
// Save LocalStorage
//################################################################################
var save_into_LocalStorage = function () {
    localStorage.setItem('stored_IntervallObj', JSON.stringify(intervalEventObject));
};
//################################################################################
// Load from LocalStorage
//################################################################################
function load_from_LocalStorage() {
    if (localStorage.getItem('stored_IntervallObj') !== null) {
        //@ts-ignore
        intervalEventObject = JSON.parse(localStorage.getItem('stored_IntervallObj'));
        fastingChangeButton.innerText = "".concat(intervalEventObject.fastingTime, ":").concat(intervalEventObject.eatTime);
        try {
            waterButton.innerText = "".concat(intervalEventObject.water.toFixed(2), " L");
        }
        catch (err) {
            // console.log(err);
            intervalEventObject.water = 0;
            waterButton.innerText = "".concat(intervalEventObject.water.toFixed(2), " L");
        }
        try {
            if (intervalEventObject.lastWater === undefined) {
                lastWater = '-';
            }
            else {
                lastWater = intervalEventObject.lastWater;
            }
        }
        catch (err) {
            // console.log(err);
            lastWater = '-';
        }
        // Identifier
        try {
            finishedFasting = intervalEventObject.finishedFasting;
            // console.log('finishedFasting', finishedFasting);
        }
        catch (err) {
            console.log(err);
            finishedFasting = [0, 0, 0, 0, 0, 0, 0];
            // console.log('finishedFasting', finishedFasting);
        }
        try {
            lastIdentifier = intervalEventObject.lastIdentifier;
        }
        catch (err) {
            console.log(err);
            lastIdentifier = '';
        }
        try {
            identifierObjStr = intervalEventObject.identifierObjStr;
        }
        catch (err) {
            // console.log(err);
            identifierObjStr = '';
        }
        // Longtime fasting
        try {
            if (intervalEventObject.longTimeFastingStart === undefined) {
                intervalEventObject.longTimeFastingStart = '';
                is_longtime_fasting = false;
                btn_start_stop_longFasting.innerHTML = 'Längeres Fasten starten';
                //console.log('longTimeFastingStart is undefined', intervalEventObject.longTimeFastingStart);
            }
            if (intervalEventObject.longTimeFastingStart !== '') {
                is_longtime_fasting = true;
                modal_longtimeFasting === null || modal_longtimeFasting === void 0 ? void 0 : modal_longtimeFasting.classList.add('active');
                btn_start_stop_longFasting.innerHTML = 'Stoppe Fasten';
                // console.log('longTimeFastingStart is set', intervalEventObject.longTimeFastingStart);
            }
            else {
                is_longtime_fasting = false;
                btn_start_stop_longFasting.innerHTML = 'Längeres Fasten starten';
                // console.log('longTimeFastingStart is empty', intervalEventObject.longTimeFastingStart);
            }
        }
        catch (error) {
            console.log('Longtime fasting error: ', error);
        }
    }
    else {
        // console.warn('Keine Daten vorh');
    }
    // console.log(intervalEventObject);
}
//################################################################################
// Heute getrunken
var waterUnit = 0.2;
// Wasserfenster einblenden
btn_ShowModalButton2 === null || btn_ShowModalButton2 === void 0 ? void 0 : btn_ShowModalButton2.addEventListener('click', function () {
    overlay2.style.display = 'block';
    outputTodayWater.innerHTML = "".concat(intervalEventObject.water.toFixed(2), " Liter");
    outputTodayWater.classList.remove('waterAnimation');
    lblLastWater.innerHTML = lastWater;
    btnWaterUnit025.classList.remove('active');
    btnWaterUnit033.classList.remove('active');
    btnWaterUnit02.classList.add('active');
    waterUnit = 0.2;
    newWaterAmount = waterUnit;
    lblAddingWater.value = "".concat(waterUnit, " L");
});
btnWaterUnit02 === null || btnWaterUnit02 === void 0 ? void 0 : btnWaterUnit02.addEventListener('click', function () {
    resetActiveWaterUnit();
    btnWaterUnit02.classList.add('active');
    waterUnit = 0.2;
    newWaterAmount = waterUnit;
    lblAddingWater.value = "".concat(waterUnit, " L");
});
btnWaterUnit025 === null || btnWaterUnit025 === void 0 ? void 0 : btnWaterUnit025.addEventListener('click', function () {
    resetActiveWaterUnit();
    btnWaterUnit025.classList.add('active');
    waterUnit = 0.25;
    newWaterAmount = waterUnit;
    lblAddingWater.value = "".concat(waterUnit, " L");
});
btnWaterUnit033 === null || btnWaterUnit033 === void 0 ? void 0 : btnWaterUnit033.addEventListener('click', function () {
    resetActiveWaterUnit();
    btnWaterUnit033.classList.add('active');
    waterUnit = 0.33;
    newWaterAmount = waterUnit;
    lblAddingWater.value = "".concat(waterUnit, " L");
});
// Resetfunc um alle Active Klassen zu entfernen
function resetActiveWaterUnit() {
    btnWaterUnit02.classList.remove('active');
    btnWaterUnit025.classList.remove('active');
    btnWaterUnit033.classList.remove('active');
}
// Modal 2 schließen
btn_CloseModal2 === null || btn_CloseModal2 === void 0 ? void 0 : btn_CloseModal2.addEventListener('click', function () {
    overlay2.style.display = 'none';
});
btn_IncreaseWater === null || btn_IncreaseWater === void 0 ? void 0 : btn_IncreaseWater.addEventListener('click', function () {
    (newWaterAmount += waterUnit).toFixed(2);
    lblAddingWater.value = "".concat(newWaterAmount.toFixed(2), " L");
});
// Wassermenge abziehen
btn_DecreaseWater === null || btn_DecreaseWater === void 0 ? void 0 : btn_DecreaseWater.addEventListener('click', function () {
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
btnSaveWater === null || btnSaveWater === void 0 ? void 0 : btnSaveWater.addEventListener('click', function () {
    intervalEventObject.water += newWaterAmount;
    if (intervalEventObject.water < 0) {
        intervalEventObject.water = 0;
    }
    else {
        lastWater = "Zuletzt ".concat(newWaterAmount, " L um ").concat(currentTime());
        intervalEventObject.lastWater = lastWater;
    }
    save_into_LocalStorage();
    waterButton.innerText = "".concat(intervalEventObject.water.toFixed(2), " L");
    outputTodayWater.innerHTML = "".concat(intervalEventObject.water.toFixed(2), " Liter");
    outputTodayWater.classList.add('waterAnimation');
    setTimeout(function () {
        overlay2.style.display = 'none';
    }, 700);
});
// Reset Water
btnReset === null || btnReset === void 0 ? void 0 : btnReset.addEventListener('click', function () {
    if (intervalEventObject.water > 0) {
        var confirm_1 = window.confirm("Soll die getrunkene Menge von ".concat(intervalEventObject.water.toFixed(2), " L wirklich zur\u00FCckgesetzt werden?"));
        if (confirm_1) {
            intervalEventObject.water = 0;
            outputTodayWater.innerHTML = "".concat(intervalEventObject.water.toFixed(2), " Liter");
            waterButton.innerText = "".concat(intervalEventObject.water.toFixed(2), " L");
            lastWater = '-';
            lblLastWater.innerHTML = lastWater;
            intervalEventObject.lastWater = lastWater;
            save_into_LocalStorage();
        }
    }
});
labelFastingTime.addEventListener('click', function () {
    labelFastingTime.disabled = true;
});
lblAddingWater.addEventListener('click', function () {
    lblAddingWater.disabled = true;
});
//################################################################################
// Chart
//################################################################################
function renderDayChart() {
    try {
        var max = -1;
        // ermittle max Wert
        for (var i = 0; i < finishedFasting.length; i++) {
            if (finishedFasting[i] > max) {
                max = finishedFasting[i];
            }
        }
        // Rendern
        for (var i = 0; i < finishedFasting.length; i++) {
            var day = "lblDay".concat(i);
            // errechne Pixelhöhe
            var pixelHeight = Math.floor((finishedFasting[i] * 180) / max);
            //@ts-ignore
            document.getElementById(day).style.height = "".concat(pixelHeight, "px");
        }
    }
    catch (err) {
        console.log(err);
    }
}
//renderDayChart();
//#######################################
//  Ermittlung letzter Fastenzeiten
//#######################################
// Diese Funktion wird alle 10 Sekunden ausgeführt und erstellt eine ID
function initIdentifier() {
    checkInterv_5Sec = 0;
    // Aktueller Identifier wird generiert
    identifierObj = new FastingIdentifier(setIdentifier(), intervalEventObject.fastingTime, intervalEventObject.fastingStartTime);
    identifierObjStr = "".concat(identifierObj.id, "/").concat(identifierObj.approxFastingStartTime, "/").concat(identifierObj.fastingTime);
    // console.log('identifierObjStr', identifierObjStr);
    // Todo Klasse FastingIdentifier anpassen.
    // Todo: ID muss besser sein
    //? Wenn Essen erlaubt ist, ID abgleichen
    if (isFastingTime === false) {
        // Neue ID wird mit gespeicherten ID abgeglichen
        if (lastIdentifier !== identifierObj.id && lastIdentifier !== '') {
            //? Auslesen des zuletzt abgespeicherten Identifiers
            var identifierObjStrInArr = identifierObjStr.split('/');
            var savedFastHr = parseInt(identifierObjStrInArr[3]);
            var savedApproxStartTime = identifierObjStrInArr[2];
            var savedStartDay = identifierObjStrInArr[0];
            var weekday = savedStartDay.substring(0, 3);
            // console.log('weekday', weekday);
            //? Funktion aufrufen, die den Index vom Wochentag zurück gibt
            var indexDay = getIndexOfWeekday(weekday);
            //? Abgleichen, ob sich die Fasten- Stunden geändert haben
            if (savedFastHr === identifierObj.fastingTime) {
                // console.log('Fastenzeit ist gleich geblieben');
                //? Sonst einfach die Fastenzeit in Stunden übernehmen
                finishedFasting.splice(indexDay, 1, savedFastHr);
                intervalEventObject.finishedFasting = finishedFasting;
            }
            else {
                //? Fastenzeit ist NICHT gleich geblieben
                if (savedApproxStartTime === identifierObj.approxFastingStartTime) {
                    // console.log('Die Startzeit ist aber gleich geblieben');
                }
                else {
                    // console.log('Auch die Startzeit hat sich geändert');
                    // Todo Diff berechnen wenn dies so ist.
                }
            }
            //? ID wird in Variable ersetzt mit neuer ID
            replaceIdentier();
        }
        else if (lastIdentifier === '') {
            // console.log('LastIdentifer war leer');
            replaceIdentier();
        }
    }
}
function replaceIdentier() {
    lastIdentifier = identifierObj.id;
    intervalEventObject.lastIdentifier = lastIdentifier;
    intervalEventObject.identifierObjStr = identifierObjStr;
    save_into_LocalStorage();
}
function getIndexOfWeekday(weekday) {
    var index = -1;
    switch (weekday) {
        case 'Mon':
            index = 0;
            break;
        case 'Tue':
            index = 1;
            break;
        case 'Wed':
            index = 2;
            break;
        case 'Thu':
            index = 3;
            break;
        case 'Fri':
            index = 4;
            break;
        case 'Sat':
            index = 5;
            break;
        case 'Sun':
            index = 6;
            break;
        default:
            break;
    }
    return index;
}
function setIdentifier() {
    // Todo: noch den Wochentag vom Vortag ermitteln
    var date = new Date();
    var dateString = "".concat(date);
    var currentDateWeekday = dateString.slice(0, 3);
    var currentDateDay = dateString.slice(8, 10);
    // Create Day + 1
    date.setDate(date.getDate() + 1); // ? +1 Tag
    dateString = "".concat(date);
    var tomorrowDateWeekday = dateString.slice(0, 3);
    var tomorrowDateDay = dateString.slice(8, 10);
    // Identifier
    var currentIdentifier = "".concat(currentDateWeekday).concat(currentDateDay, "/").concat(tomorrowDateWeekday).concat(tomorrowDateDay);
    // console.log(`currentIdentifier: ${currentIdentifier} // LastIdentifier: ${lastIdentifier}`);
    return currentIdentifier;
}
//*ANCHOR - Event Listener um lanzeitfasten zu starten und zu stoppen
btn_start_stop_longFasting === null || btn_start_stop_longFasting === void 0 ? void 0 : btn_start_stop_longFasting.addEventListener('click', function () {
    if (is_longtime_fasting === false) {
        // Start Longtime Fasting
        var confirm_longtimeFasting = window.confirm('Soll ein längeres Fasten gestartet werden?');
        if (confirm_longtimeFasting) {
            is_longtime_fasting = true;
            btn_start_stop_longFasting.innerHTML = 'Stoppe Fasten';
            var longfasting_start_stamp = new Date();
            intervalEventObject.longTimeFastingStart = String(longfasting_start_stamp);
            save_into_LocalStorage();
            modal_longtimeFasting === null || modal_longtimeFasting === void 0 ? void 0 : modal_longtimeFasting.classList.add('active');
        }
    }
    else {
        // Stopp Longtime Fasting
        var confirm_longtimeFasting_Stop = window.confirm('Soll das Fasten gestoppt werden?');
        if (confirm_longtimeFasting_Stop) {
            is_longtime_fasting = false;
            btn_start_stop_longFasting.innerHTML = 'Längeres Fasten starten';
            modal_longtimeFasting === null || modal_longtimeFasting === void 0 ? void 0 : modal_longtimeFasting.classList.remove('active');
            intervalEventObject.longTimeFastingStart = '';
            save_into_LocalStorage();
        }
    }
});
