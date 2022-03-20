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

let fastingTime: number = 16;
let eatTime: number = 8;
let newFastingTime: number = 0;
let newEatingTime: number = 0;
let isFastingTime: Boolean = false;


class EventObj {
    eventName: string;
    timeRange: number;
    startTime: Date;
    constructor(evntNm: string, tmRng: number, strtTm: Date) {
        this.eventName = evntNm;
        this.timeRange = tmRng;
        this.startTime = strtTm;
    }
}

/*
    Wenn in den Einstellungen
*/

// Einstellungen einblenden
btn_ShowModalButton?.addEventListener('click', () => {
    overlay!.style.display = 'block';
    newFastingTime = fastingTime;
    newEatingTime = eatTime;
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
    fastingTime = newFastingTime;
    eatTime = newEatingTime;
    fastingChangeButton!.innerText = `${fastingTime}:${eatTime}`;
    overlay!.style.display = 'none';
});

// Zeigt die Werte im veränderbaren Inputfeld an
function displayFastingTime() {
    labelFastingTime.value = `${newFastingTime}:${newEatingTime}`;
}

// Event setzen
btnSetNextEvent?.addEventListener('click', () => {
    console.log('Feffe');
});
