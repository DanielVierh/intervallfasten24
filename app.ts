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
    const splittedFastingTime = intervalEventObject.fastingStartTime.split(':')
    const fastingStartHour: number = parseInt(splittedFastingTime[0])
    const fastingStartMinute: number = parseInt(splittedFastingTime[1])
    const fastingStartTimeMinusEatTime: number = fastingStartHour - intervalEventObject.eatTime
    console.log(diff(`${fastingStartTimeMinusEatTime}:${fastingStartMinute}`,`${intervalEventObject.fastingStartTime}`));
    // Wenn Diff kleiner als EatingTime dann ist fasting false else fasting true


}
checkFastingStatus()

// console.log(diff('23:45','17:00'));

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
