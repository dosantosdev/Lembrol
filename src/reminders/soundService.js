let audioContext;
let alarmTimer = null;
let isAlarmPlaying = false;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
}

function playTone(context, startTime, frequency, duration, volume) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);

  gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.03);

  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function playAlarmPattern() {
  const context = getAudioContext();

  const start = context.currentTime;

  playTone(context, start, 784, 0.8, 0.16);
  playTone(context, start + 0.18, 1046.5, 1.0, 0.11);
  playTone(context, start + 0.42, 1318.5, 1.6, 0.05);
}

export function startReminderSound() {
  if (isAlarmPlaying) {
    return;
  }

  const context = getAudioContext();

  if (context.state === "suspended") {
    context.resume();
  }

  isAlarmPlaying = true;

  playAlarmPattern();

  alarmTimer = setInterval(() => {
    if (!isAlarmPlaying) {
      return;
    }

    playAlarmPattern();
  }, 2000);
}

export function stopReminderSound() {
  isAlarmPlaying = false;

  if (alarmTimer) {
    clearInterval(alarmTimer);
    alarmTimer = null;
  }
}
