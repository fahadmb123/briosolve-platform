const NOTIFICATION_SOUND_PATH = "/sounds/notification.mp3";

let sharedAudioContext: AudioContext | null = null;
let isAudioUnlocked = false;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!sharedAudioContext) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      sharedAudioContext = new AudioCtx();
    }
  }
  return sharedAudioContext;
};

const unlockAudio = (): void => {
  if (isAudioUnlocked) return;
  isAudioUnlocked = true;

  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const silentAudio = new Audio();
  silentAudio.play().catch(() => {});

  cleanupUnlockListeners();
};

const unlockEvents = ["pointerdown", "click", "keydown", "touchstart"] as const;

const cleanupUnlockListeners = (): void => {
  if (typeof window === "undefined") return;
  for (const event of unlockEvents) {
    window.removeEventListener(event, unlockAudio);
  }
};

if (typeof window !== "undefined") {
  for (const event of unlockEvents) {
    window.addEventListener(event, unlockAudio, { passive: true, once: true });
  }
}

const playSyntheticChime = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  } catch {}
};

export const playNotificationSound = (): void => {
  if (typeof window === "undefined") return;

  try {
    const audio = new Audio(NOTIFICATION_SOUND_PATH);
    audio.volume = 1.0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        playSyntheticChime();
      });
    }
  } catch {
    playSyntheticChime();
  }
};
