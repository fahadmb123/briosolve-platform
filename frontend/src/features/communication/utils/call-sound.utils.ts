const CALLING_SOUND_PATH = "/sounds/calling.wav";
const INCOMING_RING_SOUND_PATH = "/sounds/incoming-ring.wav";

let callingAudio: HTMLAudioElement | null = null;
let incomingRingAudio: HTMLAudioElement | null = null;

const getCallingAudio = (): HTMLAudioElement | null => {
  if (typeof Audio === "undefined") return null;
  if (!callingAudio) {
    callingAudio = new Audio(CALLING_SOUND_PATH);
    callingAudio.loop = true;
  }
  return callingAudio;
};

const getIncomingRingAudio = (): HTMLAudioElement | null => {
  if (typeof Audio === "undefined") return null;
  if (!incomingRingAudio) {
    incomingRingAudio = new Audio(INCOMING_RING_SOUND_PATH);
    incomingRingAudio.loop = true;
  }
  return incomingRingAudio;
};

export const startCallingSound = (): void => {
  stopIncomingRingSound();
  const audio = getCallingAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

export const stopCallingSound = (): void => {
  if (!callingAudio) return;
  callingAudio.pause();
  callingAudio.currentTime = 0;
};

export const startIncomingRingSound = (): void => {
  stopCallingSound();
  const audio = getIncomingRingAudio();
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

export const stopIncomingRingSound = (): void => {
  if (!incomingRingAudio) return;
  incomingRingAudio.pause();
  incomingRingAudio.currentTime = 0;
};

export const stopCallSounds = (): void => {
  stopCallingSound();
  stopIncomingRingSound();
};

