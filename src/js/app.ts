/*
Erstellungsdatum: 18.03.2022 - Daniel Vierheilig
*/

const overlay = document.getElementById('overlay');
const overlay2 = document.getElementById('overlay2');
const btn_ShowModalButton = document.getElementById('btn_ShowModal');
const btn_ShowModalButton2 = document.getElementById('btn_ShowModal2');
const btn_CloseModal = document.getElementById('close-modal');
const btn_CloseModal2 = document.getElementById('close-modal2');
const btn_DecreaseFasting = document.getElementById('btn_DecreaseFasting');
const btn_DecreaseWater = document.getElementById('btn_DecreaseWater');
const btn_IncreaseFasting = document.getElementById('btn_IncreaseFasting');
const btn_IncreaseWater = document.getElementById('btn_IncreaseWater');
const labelFastingTime = document.getElementById(
    'lblfastingTime',
) as HTMLInputElement;
const fastingChangeButton = document.getElementById('fastingChangeButton');
const btn_SaveSettings = document.getElementById('btnSaveSettings');
const btnSetNextEvent = document.getElementById('btnSetNextEvent');
const inpFastingStartTime = document.getElementById(
    'inpFastingStartTime',
) as HTMLInputElement;
const outputWhatNow = document.getElementById(
    'outputWhatNow',
) as HTMLInputElement;
const lblTimer = document.getElementById('lblTimer') as HTMLInputElement;
const txtPercent = document.getElementById('txtPercent') as any;
const circleTrack = document.getElementById('circleTrack');
const progressCircle = document.querySelector('.progress') as any;
const outputFrom = document.getElementById('outputFrom');
const outputTo = document.getElementById('outputTo');
const themeStyle = document.getElementById('themeStyle') as HTMLInputElement;
const btnWaterUnit02 = document.getElementById('btnWaterUnit02');
const btnWaterUnit025 = document.getElementById('btnWaterUnit025');
const btnWaterUnit033 = document.getElementById('btnWaterUnit033');
const lblAddingWater = document.getElementById(
    'lblAddingWater',
) as HTMLInputElement;
const outputTodayWater = document.getElementById('outputTodayWater');
const btnSaveWater = document.getElementById('btnSaveWater');
const waterButton = document.getElementById('waterButton');
const btnReset = document.getElementById('btnReset');
const lblLastWater = document.getElementById('lblLastWater');

let newFastingTime: number = 0;
let newEatingTime: number = 0;
let isFastingTime: boolean = false;
let newWaterAmount: number = 0.2;
let lastWater: string = '-';

let finishedFasting = [0, 0, 0, 0, 0, 0, 0];
let checkInterv_5Sec: number = 0;
let lastIdentifier = '';
let identifierObjStr: string = '';

let intervalEventObject: {
    fastingTime: number;
    eatTime: number;
    fastingStartTime: string;
    theme: string;
    water: number;
    lastWater: string;
    finishedFasting: number[];
    lastIdentifier: string;
    identifierObjStr: string;
} = {
    fastingTime: 16,
    eatTime: 8,
    fastingStartTime: '17:00',
    theme: 'light',
    water: 0,
    lastWater: '-',
    finishedFasting: [0, 0, 0, 0, 0, 0, 0],
    lastIdentifier: '',
    identifierObjStr: identifierObjStr,
};

class FastingIdentifier {
    id: string;
    fastingTime: number;
    approxFastingStartTime: string;
    constructor(
        id: string,
        fastingTime: number,
        approxFastingStartTime: string,
    ) {
        this.id = id;
        this.fastingTime = fastingTime;
        this.approxFastingStartTime = approxFastingStartTime;
    }
}
let identifierObj = new FastingIdentifier('', 0, '');

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
    const body = document.body;
    body.classList.remove('lightTheme');
    body.classList.remove('darkTheme');
    lblTimer.classList.remove('lightPercentColor');
    circleTrack?.classList.remove('darkThemeRing');
    circleTrack?.classList.remove('lightThemeRing');
    btn_ShowModalButton?.classList.remove("smallButton-dark");
    btn_ShowModalButton2?.classList.remove("smallButton-dark");

    if (intervalEventObject.theme === 'Dunkel') {
        body.classList.add('darkTheme');
        circleTrack?.classList.add('darkThemeRing');
        btn_ShowModalButton?.classList.add("smallButton-dark");
        btn_ShowModalButton2?.classList.add("smallButton-dark");
    } else {
        body.classList.add('lightTheme');
        lblTimer.classList.add('lightPercentColor');
        circleTrack?.classList.add('lightThemeRing');
    }
}

window.addEventListener("scroll", ()=>{
    let scrollHeigth = Math.floor(window.pageYOffset)
    if(scrollHeigth > 0) {
        outputWhatNow.classList.add("smallerTitle");
        console.log('Größer');

    }else{
        outputWhatNow.classList.remove("smallerTitle");
        console.log('Kleiner');

    }
    console.log(scrollHeigth);

})

//#########################################################################
// Funktion zur Überprüfung, ob gerade Fastenzeit läuft
// Entsprechend wird die Anzeige der UI Elemente angepasst
//#########################################################################
function checkFastingStatus() {
    // Es wird alle 10 Sekunden die ...
    checkInterv_5Sec < 5 ? checkInterv_5Sec++ : initIdentifier();

    const now = currentTime();
    const splittedFastingTime = intervalEventObject.fastingStartTime.split(':');
    const fastingStartHour: number = parseInt(splittedFastingTime[0]);
    const fastingStartMinute: number = parseInt(splittedFastingTime[1]);
    let fastingStartTimeMinusEatTime: number =
        fastingStartHour - intervalEventObject.eatTime;
    if (fastingStartTimeMinusEatTime < 0) {
        fastingStartTimeMinusEatTime = 24 + fastingStartTimeMinusEatTime;
    }
    const diffToFasting = diff(
        `${now}`,
        `${intervalEventObject.fastingStartTime}`,
    );
    const diffToEating = diff(
        `${now}`,
        `${fastingStartTimeMinusEatTime}:${fastingStartMinute}`,
    );
    const diffToFastingInPercent = (
        (timeStampIntoNumber(diffToFasting) * 100) /
        (intervalEventObject.eatTime * 60 * 60)
    ).toFixed(1);
    const diffToEatingInPercent = (
        (timeStampIntoNumber(diffToEating) * 100) /
        (intervalEventObject.fastingTime * 60 * 60)
    ).toFixed(1);
    const diffToFastingInSeconds = timeStampIntoNumber(diffToFasting);
    // Wenn Diff kleiner als EatingTime dann ist fasting = false sonst fasting = true
    if (diffToFastingInSeconds < intervalEventObject.eatTime * 60 * 60) {
        isFastingTime = false;
        outputWhatNow.innerHTML = 'Jetzt: Essen';
        lblTimer.innerHTML = `${diffToFasting}`;
        btnSetNextEvent!.innerHTML = 'Fasten starten';
        // txtPercent.innerHTML = `${diffToFastingInPercent}%`;
        outputFrom!.innerHTML = `${addZero(
            fastingStartTimeMinusEatTime,
        )}:${addZero(fastingStartMinute)}`;
        outputTo!.innerHTML = `${intervalEventObject.fastingStartTime}`;
        circleProgress(parseInt(diffToFastingInPercent));
    } else {
        isFastingTime = true;
        outputWhatNow.innerHTML = 'Jetzt: Fasten';
        lblTimer.innerHTML = `${diffToEating}`;
        btnSetNextEvent!.innerHTML = 'Essen starten';
        // txtPercent.innerHTML = `${diffToEatingInPercent}%`;
        outputFrom!.innerHTML = `${intervalEventObject.fastingStartTime}`;
        outputTo!.innerHTML = `${addZero(
            fastingStartTimeMinusEatTime,
        )}:${addZero(fastingStartMinute)}`;
        circleProgress(parseInt(diffToEatingInPercent));
    }
}

let radius = progressCircle.r.baseVal.value;
let circumference = radius * 2 * Math.PI;
progressCircle.style.strokeDasharray = circumference;
function circleProgress(percent: number) {
    progressCircle.style.strokeDashoffset =
        circumference - (percent / 100) * circumference;
}

function timeStampIntoNumber(timeStamp: string) {
    const splittedTimestamp = timeStamp.split(':');
    const splittedHour_inSeconds: number =
        parseInt(splittedTimestamp[0]) * 60 * 60;
    const splittedMinute_inSeconds: number =
        parseInt(splittedTimestamp[1]) * 60;
    const secondsSum = splittedHour_inSeconds + splittedMinute_inSeconds;
    // console.log('Timestamp in Sec: ', secondsSum);
    return secondsSum;
}

function currentTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const now = `${addZero(hours)}:${addZero(minutes)}`;
    return now;
}

// Sekündlicher Funktionsaufruf für Check Func
function checkIntervall() {
    setInterval(() => {
        checkFastingStatus();
    }, 1000);
}

function addZero(val: any) {
    if (val < 10) {
        val = '0' + val;
    }
    return val;
}

// Diff Berechnung
function diff(start: any, end: any) {
    start = start.split(':');
    end = end.split(':');
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    if (hours < 0) hours = hours + 24;
    return (
        (hours <= 9 ? '0' : '') +
        hours +
        ':' +
        (minutes <= 9 ? '0' : '') +
        minutes
    );
}

// Einstellungen einblenden
btn_ShowModalButton?.addEventListener('click', () => {
    overlay!.style.display = 'block';
    newFastingTime = intervalEventObject.fastingTime;
    newEatingTime = intervalEventObject.eatTime;
    inpFastingStartTime!.value = intervalEventObject.fastingStartTime;
    themeStyle!.value = intervalEventObject.theme;
    displayFastingTime();
});

// Fasten Wert rauf und runter schalten
btn_IncreaseFasting?.addEventListener('click', () => {
    changeFastingTime('incre');
});

// Fasten Wert rauf und runter schalten
btn_DecreaseFasting?.addEventListener('click', () => {
    changeFastingTime('decr');
});

// Einstellungen ausblenden
btn_CloseModal?.addEventListener('click', () => {
    overlay!.style.display = 'none';
});

// Fastenzeit ändern
function changeFastingTime(direction: string) {
    // Fasten verlängern
    if (direction === 'incre') {
        if (newFastingTime < 23) {
            newFastingTime++;
            newEatingTime = 24 - newFastingTime;
            displayFastingTime();
        }
        // Fasten verkürzen
    } else {
        if (newFastingTime > 13) {
            newFastingTime--;
            newEatingTime = 24 - newFastingTime;
            displayFastingTime();
        }
    }
}

// Einstellungen speichern
btn_SaveSettings?.addEventListener('click', () => {
    intervalEventObject.fastingTime = newFastingTime;
    intervalEventObject.eatTime = newEatingTime;
    intervalEventObject.fastingStartTime = inpFastingStartTime!.value;
    intervalEventObject.theme = themeStyle!.value;
    fastingChangeButton!.innerText = `${intervalEventObject.fastingTime}:${intervalEventObject.eatTime}`;
    overlay!.style.display = 'none';
    save_into_LocalStorage();
    setTheme();
});

// Zeigt die Werte im veränderbaren Inputfeld an
function displayFastingTime() {
    labelFastingTime.value = `${newFastingTime}:${newEatingTime}`;
}

// Event setzen
btnSetNextEvent?.addEventListener('click', () => {
    let nextEvent = '';
    isFastingTime ? (nextEvent = 'Essen') : (nextEvent = 'Fasten');
    const request = window.confirm(
        `Möchtest du die Phase: "${nextEvent}" wirklich vorzeitig starten?`,
    );
    if (request) {
        const now = currentTime();
        const splittedNow = now.split(':');
        const minuteMinus1 = parseInt(splittedNow[1]) - 1;
        if (isFastingTime === true) {
            // Berechne neue Fastenzeit now + Essenszeit
            let newFastingStartRaw =
                parseInt(splittedNow[0]) + intervalEventObject.eatTime;
            if (newFastingStartRaw > 24)
                newFastingStartRaw = newFastingStartRaw - 24;
            const newFastingStart = `${addZero(newFastingStartRaw)}:${addZero(
                minuteMinus1,
            )}`;
            intervalEventObject.fastingStartTime = newFastingStart;
        } else {
            // Setze jetzige Zeit als Fastenzeit
            intervalEventObject.fastingStartTime = `${splittedNow[0]}:${addZero(
                minuteMinus1,
            )}`;
        }
        save_into_LocalStorage();
    }
});

//################################################################################
// Save LocalStorage
//################################################################################
const save_into_LocalStorage = () => {
    localStorage.setItem(
        'stored_IntervallObj',
        JSON.stringify(intervalEventObject),
    );
};

//################################################################################
// Load from LocalStorage
//################################################################################
function load_from_LocalStorage() {
    if (localStorage.getItem('stored_IntervallObj') !== null) {
        //@ts-ignore
        intervalEventObject = JSON.parse(localStorage.getItem('stored_IntervallObj'),
        );
        fastingChangeButton!.innerText = `${intervalEventObject.fastingTime}:${intervalEventObject.eatTime}`;
        try {
            waterButton!.innerText = `${intervalEventObject.water.toFixed(
                2,
            )} L`;
        } catch (err) {
            // console.log(err);
            intervalEventObject.water = 0;
            waterButton!.innerText = `${intervalEventObject.water.toFixed(
                2,
            )} L`;
        }
        try {
            if (intervalEventObject.lastWater === undefined) {
                lastWater = '-';
            } else {
                lastWater = intervalEventObject.lastWater;
            }
        } catch (err) {
            // console.log(err);
            lastWater = '-';
        }
        // Identifier
        try {
            finishedFasting = intervalEventObject.finishedFasting;
            // console.log('finishedFasting', finishedFasting);
        } catch (err) {
            console.log(err);
            finishedFasting = [0, 0, 0, 0, 0, 0, 0];
            // console.log('finishedFasting', finishedFasting);
        }
        try {
            lastIdentifier = intervalEventObject.lastIdentifier;
        } catch (err) {
            console.log(err);
            lastIdentifier = '';
        }

        try {
            identifierObjStr = intervalEventObject.identifierObjStr;
        } catch (err) {
            // console.log(err);
            identifierObjStr = '';
        }
    } else {
        // console.warn('Keine Daten vorh');
    }
    // console.log(intervalEventObject);
}

//################################################################################
// Heute getrunken
let waterUnit: number = 0.2;

// Wasserfenster einblenden
btn_ShowModalButton2?.addEventListener('click', () => {
    overlay2!.style.display = 'block';
    outputTodayWater!.innerHTML = `${intervalEventObject.water.toFixed(2)} Liter`;
    outputTodayWater!.classList.remove('waterAnimation');
    lblLastWater!.innerHTML = lastWater;
});

btnWaterUnit02?.addEventListener('click', () => {
    resetActiveWaterUnit();
    btnWaterUnit02!.classList.add('active');
    waterUnit = 0.2;
    newWaterAmount = waterUnit;
    lblAddingWater.value = `${waterUnit} L`;
});
btnWaterUnit025?.addEventListener('click', () => {
    resetActiveWaterUnit();
    btnWaterUnit025!.classList.add('active');
    waterUnit = 0.25;
    newWaterAmount = waterUnit;
    lblAddingWater.value = `${waterUnit} L`;
});
btnWaterUnit033?.addEventListener('click', () => {
    resetActiveWaterUnit();
    btnWaterUnit033!.classList.add('active');
    waterUnit = 0.33;
    newWaterAmount = waterUnit;
    lblAddingWater.value = `${waterUnit} L`;
});

// Resetfunc um alle Active Klassen zu entfernen
function resetActiveWaterUnit() {
    btnWaterUnit02!.classList.remove('active');
    btnWaterUnit025!.classList.remove('active');
    btnWaterUnit033!.classList.remove('active');
}

// Modal 2 schließen
btn_CloseModal2?.addEventListener('click', () => {
    overlay2!.style.display = 'none';
});

btn_IncreaseWater?.addEventListener('click', () => {
    (newWaterAmount += waterUnit).toFixed(2);
    lblAddingWater.value = `${newWaterAmount.toFixed(2)} L`;
});

// Wassermenge abziehen
btn_DecreaseWater?.addEventListener('click', () => {
    if (newWaterAmount > waterUnit) {
        (newWaterAmount -= waterUnit).toFixed(2);
        lblAddingWater.value = `${newWaterAmount.toFixed(2)} L`;
    } else {
        newWaterAmount = 0 - waterUnit;
        lblAddingWater.value = `${newWaterAmount.toFixed(2)} L`;
    }
});

// Speichere neue Wassermenge
btnSaveWater?.addEventListener('click', () => {
    intervalEventObject.water += newWaterAmount;
    if (intervalEventObject.water < 0) {
        intervalEventObject.water = 0;
    } else {
        lastWater = `Zuletzt ${newWaterAmount} L um ${currentTime()}`;
        intervalEventObject.lastWater = lastWater;
    }

    save_into_LocalStorage();
    waterButton!.innerText = `${intervalEventObject.water.toFixed(2)} L`;
    outputTodayWater!.innerHTML = `${intervalEventObject.water.toFixed(
        2,
    )} Liter`;
    outputTodayWater!.classList.add('waterAnimation');
    setTimeout(() => {
        overlay2!.style.display = 'none';
    }, 700);
});

// Reset Water
btnReset?.addEventListener('click', () => {
    if (intervalEventObject.water > 0) {
        const confirm = window.confirm(
            `Soll die getrunkene Menge von ${intervalEventObject.water.toFixed(2)} L wirklich zurückgesetzt werden?`);
        if (confirm) {
            intervalEventObject.water = 0;
            outputTodayWater!.innerHTML = `${intervalEventObject.water.toFixed(2)} Liter`;
            waterButton!.innerText = `${intervalEventObject.water.toFixed(2)} L`;
            lastWater = '-';
            lblLastWater!.innerHTML = lastWater;
            intervalEventObject.lastWater = lastWater;
            save_into_LocalStorage();
        }
    }
});

labelFastingTime.addEventListener('click', () => {
    labelFastingTime.disabled = true;
});

lblAddingWater.addEventListener('click', () => {
    lblAddingWater.disabled = true;
});

//################################################################################
// Chart
//################################################################################

function renderDayChart() {
    try {
        let max = -1;
        // ermittle max Wert
        for (let i = 0; i < finishedFasting.length; i++) {
            if (finishedFasting[i] > max) {
                max = finishedFasting[i];
            }
        }
        // Rendern
        for (let i = 0; i < finishedFasting.length; i++) {
            const day = `lblDay${i}`;
            // errechne Pixelhöhe
            const pixelHeight = Math.floor((finishedFasting[i] * 180) / max);
            //@ts-ignore
            document.getElementById(day).style.height = `${pixelHeight}px`;
        }
    } catch (err) {
        console.log(err);
    }
}

renderDayChart();


//#######################################
//  Ermittlung letzter Fastenzeiten
//#######################################
// Diese Funktion wird alle 10 Sekunden ausgeführt und erstellt eine ID
function initIdentifier() {
    checkInterv_5Sec = 0;
    // Aktueller Identifier wird generiert
    identifierObj = new FastingIdentifier(
        setIdentifier(),
        intervalEventObject.fastingTime,
        intervalEventObject.fastingStartTime,
    );
    identifierObjStr = `${identifierObj.id}/${identifierObj.approxFastingStartTime}/${identifierObj.fastingTime}`;
    // console.log('identifierObjStr', identifierObjStr);

    // Todo Klasse FastingIdentifier anpassen.
    // Todo: ID muss besser sein
    //? Wenn Essen erlaubt ist, ID abgleichen
    if (isFastingTime === false) {
        // Neue ID wird mit gespeicherten ID abgeglichen
        if (lastIdentifier !== identifierObj.id && lastIdentifier !== '') {
            //? Auslesen des zuletzt abgespeicherten Identifiers
            const identifierObjStrInArr = identifierObjStr.split('/');
            const savedFastHr: number = parseInt(identifierObjStrInArr[3]);
            const savedApproxStartTime = identifierObjStrInArr[2];
            const savedStartDay = identifierObjStrInArr[0];
            const weekday = savedStartDay.substring(0, 3);
            // console.log('weekday', weekday);
            //? Funktion aufrufen, die den Index vom Wochentag zurück gibt
            const indexDay = getIndexOfWeekday(weekday);
            //? Abgleichen, ob sich die Fasten- Stunden geändert haben
            if(savedFastHr === identifierObj.fastingTime) {
                // console.log('Fastenzeit ist gleich geblieben');
                //? Sonst einfach die Fastenzeit in Stunden übernehmen
                finishedFasting.splice(indexDay, 1, savedFastHr)
                intervalEventObject.finishedFasting = finishedFasting;
            }else{
                //? Fastenzeit ist NICHT gleich geblieben
                if(savedApproxStartTime === identifierObj.approxFastingStartTime) {
                    // console.log('Die Startzeit ist aber gleich geblieben');
                }else{
                    // console.log('Auch die Startzeit hat sich geändert');
                     // Todo Diff berechnen wenn dies so ist.
                }
            }
            //? ID wird in Variable ersetzt mit neuer ID
            replaceIdentier();
        }else if(lastIdentifier === '') {
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

function getIndexOfWeekday(weekday: string) {
    let index = -1;
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
    let date = new Date();
    let dateString = `${date}`;
    const currentDateWeekday = dateString.slice(0, 3);
    const currentDateDay = dateString.slice(8, 10);

    // Create Day + 1
    date.setDate(date.getDate() + 1); // ? +1 Tag
    dateString = `${date}`;
    const tomorrowDateWeekday = dateString.slice(0, 3);
    const tomorrowDateDay = dateString.slice(8, 10);
    // Identifier
    const currentIdentifier = `${currentDateWeekday}${currentDateDay}/${tomorrowDateWeekday}${tomorrowDateDay}`;

    // console.log(`currentIdentifier: ${currentIdentifier} // LastIdentifier: ${lastIdentifier}`);
    return currentIdentifier;
}
