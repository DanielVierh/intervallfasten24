const overlay = document.getElementById('overlay');
const btn_ShowModalButton = document.getElementById('btn_ShowModal');
const btn_CloseModal = document.getElementById('close-modal');
const btn_DecreaseFasting = document.getElementById('btn_DecreaseFasting');
const btn_IncreaseFasting = document.getElementById('btn_IncreaseFasting');
const labelFastingTime = document.getElementById(
    'lblfastingTime',
) as HTMLInputElement;
const fastingChangeButton = document.getElementById('fastingChangeButton');
const btn_SaveSettings = document.getElementById('btnSaveSettings');
const btnSetNextEvent = document.getElementById('btnSetNextEvent');
const inpFastingStartTime = document.getElementById(
    'inpFastingStartTime',
) as HTMLInputElement;
const outputWhatNow = document.getElementById("outputWhatNow") as HTMLInputElement;
const lblTimer = document.getElementById("lblTimer") as HTMLInputElement;

let newFastingTime: number = 0;
let newEatingTime: number = 0;
let isFastingTime: Boolean = false;


let intervalEventObject: {fastingTime: number; eatTime: number; fastingStartTime: string} = {
    fastingTime: 17,
    eatTime: 7,
    fastingStartTime: '17:00'
};

// Wenn 17:00 Fasten-Start ist: um zu ermitteln, in welchem Bereich wir uns gegenw. befinden
// Aktuelle Uhrzeit als Variable matchen mit Intervallfasten Start - Essen
// Essen = 8 Stunden -- 17:00 - 8 Stunden
// Wenn aktuelle Uhrzeit innerhalb dieser Range, isFasting auf false setzen
// Zeit runterzählen bis 17:00

// Wenn nach 17:00 Uhr und vor Essens Range, isFasting auf true setzen
// und zeit bis vor Essens Range
function checkFastingStatus() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const now = `${addZero(hours)}:${addZero(minutes)}`
    const splittedFastingTime = intervalEventObject.fastingStartTime.split(':')
    const fastingStartHour: number = parseInt(splittedFastingTime[0])
    const fastingStartMinute: number = parseInt(splittedFastingTime[1])
    const fastingStartTimeMinusEatTime: number = fastingStartHour - intervalEventObject.eatTime

    // console.log(diff(`${now}`,`${intervalEventObject.fastingStartTime}`));
    // console.log(`${fastingStartTimeMinusEatTime}:${fastingStartMinute}`);
    const diffToFasting = diff(`${now}`,`${intervalEventObject.fastingStartTime}`)
    const diffToEating = diff(`${now}`,`${fastingStartTimeMinusEatTime}:${fastingStartMinute}`)
    console.log('DiffToEating', diffToEating);
    
    const diffToFastingInSeconds = timeStampIntoNumber(diffToFasting)
    // console.log('Essenszeit in Sec: ', intervalEventObject.eatTime * 60 * 60);
        // Wenn Diff kleiner als EatingTime dann ist fasting false else fasting true
    if(diffToFastingInSeconds < (intervalEventObject.eatTime * 60 * 60)) {
        // console.log("Fasten is false");
        outputWhatNow.innerHTML = "Jetzt: Essen";
        lblTimer.innerHTML = `${diffToFasting}`
    }else{
        // console.log("Fasten is true");
        outputWhatNow.innerHTML = "Jetzt: Fasten";
        lblTimer.innerHTML = `${diffToEating}`
    }

}

function timeStampIntoNumber(timeStamp: string) {
    const splittedTimestamp = timeStamp.split(':')
    const splittedHour_inSeconds: number = parseInt(splittedTimestamp[0]) * 60 * 60
    const splittedMinute_inSeconds: number = parseInt(splittedTimestamp[1]) * 60
    const secondsSum = splittedHour_inSeconds + splittedMinute_inSeconds;
    // console.log('Timestamp in Sec: ', secondsSum);
    
    return secondsSum
}

// Sekündlicher Funktionsaufruf für Check Func
function checkIntervall() {
    setInterval(() => {
        checkFastingStatus()
    }, 1000);
}

checkIntervall();

function addZero(val: any) {
    if(val < 10) {
        val = '0' + val
    }
    return val;
}


// Diff Berechnung
function diff(start: any, end: any) {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    if (hours < 0)
       hours = hours + 24;
    return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
}


// Einstellungen einblenden
btn_ShowModalButton?.addEventListener('click', () => {
    overlay!.style.display = 'block';
    newFastingTime = intervalEventObject.fastingTime;
    newEatingTime = intervalEventObject.eatTime;
    inpFastingStartTime!.value = intervalEventObject.fastingStartTime;
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
        if (newFastingTime > 2) {
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
    console.log(inpFastingStartTime!.value);
    intervalEventObject.fastingStartTime = inpFastingStartTime!.value
    fastingChangeButton!.innerText = `${intervalEventObject.fastingTime}:${intervalEventObject.eatTime}`;
    overlay!.style.display = 'none';
});

// Zeigt die Werte im veränderbaren Inputfeld an
function displayFastingTime() {
    labelFastingTime.value = `${newFastingTime}:${newEatingTime}`;
}

// Event setzen
btnSetNextEvent?.addEventListener('click', () => {
    console.log('Fasten starten');
});
