let audioContext;

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

export function playReminderSound() {
  const context = getAudioContext();

  if (context.state === "suspended") {
    context.resume();
  }

  const start = context.currentTime;

  // Toque principal: curto e brilhante.
  playTone(context, start, 784, 0.9, 0.16);

  // Segunda nota: dá a sensação de "magia".
  playTone(context, start + 0.18, 1046.5, 1.1, 0.11);

  // Pequena ressonância final.
  playTone(context, start + 0.42, 1318.5, 2.2, 0.045);
}
