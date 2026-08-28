let audioContext = null;
let currentAudio = null;
let currentSoundLoop = null;

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

async function playFile(source, loop = false) {
  if (!source) {
    console.error("Fonte de áudio inválida.");

    return false;
  }

  const audio = new Audio(source);

  audio.loop = loop;
  audio.volume = 1;

  currentAudio = audio;

  audio.addEventListener(
    "error",
    () => {
      console.error("Erro ao carregar áudio:", audio.error);
    },
    { once: true },
  );

  try {
    await audio.play();

    return true;
  } catch (error) {
    console.error("Erro ao reproduzir áudio:", error);

    if (currentAudio === audio) {
      currentAudio = null;
    }

    return false;
  }
}

function playLembrolSound(loop = false) {
  const context = getAudioContext();

  if (context.state === "suspended") {
    context.resume();
  }

  const start = context.currentTime;

  playTone(context, start, 784, 0.9, 0.16);

  playTone(context, start + 0.18, 1046.5, 1.1, 0.11);

  playTone(context, start + 0.42, 1318.5, 2.2, 0.045);

  if (loop) {
    currentSoundLoop = setTimeout(() => {
      playLembrolSound(true);
    }, 3000);
  }
}

async function getSystemSoundPath(type) {
  if (!window.electronAPI?.getSystemSoundPath) {
    return null;
  }

  return window.electronAPI.getSystemSoundPath(type);
}

async function playSystemSound(type, loop = false) {
  const soundPath = await getSystemSoundPath(type);

  if (!soundPath) {
    console.error("Som do sistema não encontrado:", type);

    return false;
  }

  return playFile(
    `file:///${soundPath.replace(/\\/g, "/").replace(/ /g, "%20")}`,
    loop,
  );
}

async function getCustomSoundData(filePath) {
  if (!filePath || !window.electronAPI?.getCustomSoundData) {
    return null;
  }

  return window.electronAPI.getCustomSoundData(filePath);
}

async function playCustomSound(filePath) {
  const audioData = await getCustomSoundData(filePath);

  if (!audioData) {
    console.error("Não foi possível carregar o áudio personalizado.");

    return false;
  }

  return playFile(audioData, true);
}

export async function startReminderSound(
  soundType = "lembrol",
  customSound = null,
) {
  stopReminderSound();

  if (soundType === "custom") {
    if (!customSound) {
      console.error("Nenhum áudio personalizado foi configurado.");

      return false;
    }

    return playCustomSound(customSound);
  }

  if (soundType === "system") {
    return playSystemSound("notification", true);
  }

  if (soundType === "alarm") {
    return playSystemSound("alarm", true);
  }

  playLembrolSound(true);

  return true;
}

export function stopReminderSound() {
  if (currentSoundLoop) {
    clearTimeout(currentSoundLoop);

    currentSoundLoop = null;
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;

    currentAudio = null;
  }
}

export async function testReminderSound(
  soundType = "lembrol",
  customSound = null,
) {
  stopReminderSound();

  return startReminderSound(soundType, customSound);
}

export function playReminderSound() {
  playLembrolSound(false);
}
