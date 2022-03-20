var overlay = document.getElementById('overlay');
var btn_ShowModalButton = document.getElementById('btn_ShowModal');
var btn_CloseModal = document.getElementById('close-modal');
var btn_DecreaseFasting = document.getElementById('btn_DecreaseFasting');
var btn_IncreaseFasting = document.getElementById('btn_IncreaseFasting');
var labelFastingTime = document.getElementById('lblfastingTime');
var fastingChangeButton = document.getElementById('fastingChangeButton');
var btn_SaveSettings = document.getElementById('btnSaveSettings');
var btnSetNextEvent = document.getElementById('btnSetNextEvent');
var fastingTime = 16;
var eatTime = 8;
var newFastingTime = 0;
var newEatingTime = 0;
// Einstellungen einblenden
btn_ShowModalButton === null || btn_ShowModalButton === void 0 ? void 0 : btn_ShowModalButton.addEventListener('click', function () {
    overlay.style.display = 'block';
    newFastingTime = fastingTime;
    newEatingTime = eatTime;
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
    fastingTime = newFastingTime;
    eatTime = newEatingTime;
    fastingChangeButton.innerText = "".concat(fastingTime, ":").concat(eatTime);
    overlay.style.display = 'none';
});
// Zeigt die Werte im veränderbaren Inputfeld an  
function displayFastingTime() {
    labelFastingTime.value = "".concat(newFastingTime, ":").concat(newEatingTime);
}
// Event setzen
btnSetNextEvent === null || btnSetNextEvent === void 0 ? void 0 : btnSetNextEvent.addEventListener("click", function () {
    console.log("Feffe");
});
