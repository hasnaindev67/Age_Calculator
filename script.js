// ---------- Page-load preloader ----------
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    document.getElementById('pageContent').classList.add('ready');
  }, 700); // brief, deliberate pause so the loader actually registers
});

// ---------- Age calculation ----------
const dobInput = document.getElementById('dob');
const calcBtn  = document.getElementById('calcBtn');
const errMsg   = document.getElementById('errMsg');
const result   = document.getElementById('result');

let birthDate = null;
let timerId = null;

// don't allow future dates
dobInput.max = new Date().toISOString().split('T')[0];

calcBtn.addEventListener('click', startCalculation);
dobInput.addEventListener('keydown', e => { if(e.key === 'Enter') startCalculation(); });

function startCalculation(){
  const val = dobInput.value;
  if(!val){
    showError('Please choose a date of birth first.');
    return;
  }
  const chosen = new Date(val + 'T00:00:00');
  const now = new Date();

  if(isNaN(chosen.getTime()) || chosen > now){
    showError("That date can't be in the future — please pick a valid date of birth.");
    return;
  }

  hideError();
  setButtonLoading(true);

  // Small, deliberate delay so the loading state is felt, not just flashed
  setTimeout(() => {
    birthDate = chosen;

    if(timerId) clearInterval(timerId);
    updateElapsed();
    timerId = setInterval(updateElapsed, 1000);

    result.classList.add('show');
    requestAnimationFrame(() => result.classList.add('visible'));

    setButtonLoading(false);
  }, 600);
}

function setButtonLoading(isLoading){
  calcBtn.disabled = isLoading;
  dobInput.disabled = isLoading;
  calcBtn.classList.toggle('loading', isLoading);
}

function showError(msg){
  errMsg.textContent = msg;
  errMsg.style.display = 'block';
  result.classList.remove('show', 'visible');
  if(timerId){ clearInterval(timerId); timerId = null; }
}
function hideError(){
  errMsg.style.display = 'none';
}

function updateElapsed(){
  const now = new Date();

  // Calendar-accurate years / months / days
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if(days < 0){
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if(months < 0){
    years -= 1;
    months += 12;
  }

  // Total elapsed time since birth, in each unit
  let diffMs = now - birthDate;
  let totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours   = Math.floor(totalMinutes / 60);

  document.getElementById('yearsBig').textContent = years;
  document.getElementById('uYears').textContent  = years;
  document.getElementById('uMonths').textContent = months;
  document.getElementById('uDays').textContent   = days;
  document.getElementById('uHours').textContent  = totalHours.toLocaleString();
  document.getElementById('uMins').textContent   = totalMinutes.toLocaleString();
  document.getElementById('uSecs').textContent   = totalSeconds.toLocaleString();
}
