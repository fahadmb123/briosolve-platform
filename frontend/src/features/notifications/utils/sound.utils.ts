const NOTIFICATION_SOUND_PATH = "/sounds/notification.mp3";

let sharedAudioContext: AudioContext | null = null;
let cachedAudioBuffer: AudioBuffer | null = null;
let cachedAudioElement: HTMLAudioElement | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!sharedAudioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      sharedAudioContext = new AudioCtx();
    }
  }
  return sharedAudioContext;
};

const preloadAudioBuffer = async (): Promise<void> => {
  const ctx = getAudioContext();
  if (!ctx || cachedAudioBuffer) return;

  try {
    const response = await fetch(NOTIFICATION_SOUND_PATH);
    const arrayBuffer = await response.arrayBuffer();
    cachedAudioBuffer = await ctx.decodeAudioData(arrayBuffer);
  } catch {
    cachedAudioBuffer = null;
  }
};

const unlockAudio = (): void => {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  if (typeof Audio !== "undefined" && !cachedAudioElement) {
    try {
      cachedAudioElement = new Audio(NOTIFICATION_SOUND_PATH);
      cachedAudioElement.preload = "auto";
      cachedAudioElement.load();
    } catch {}
  }

  if (!cachedAudioBuffer) {
    preloadAudioBuffer().catch(() => {});
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("click", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true });

  setTimeout(() => {
    preloadAudioBuffer().catch(() => {});
  }, 100);
}

const playSyntheticChime = (ctx: AudioContext): void => {
  try {
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

  const ctx = getAudioContext();

  if (ctx && ctx.state === "running" && cachedAudioBuffer) {
    try {
      const source = ctx.createBufferSource();
      source.buffer = cachedAudioBuffer;
      const gain = ctx.createGain();
      gain.gain.value = 1.0;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
      return;
    } catch {}
  }

  if (cachedAudioElement) {
    try {
      cachedAudioElement.currentTime = 0;
      const promise = cachedAudioElement.play();
      if (promise !== undefined) {
        promise.catch(() => {
          if (ctx) {
            if (ctx.state === "suspended") {
              ctx.resume().then(() => playSyntheticChime(ctx)).catch(() => {});
            } else {
              playSyntheticChime(ctx);
            }
          }
        });
        return;
      }
    } catch {}
  }

  try {
    const audio = new Audio(NOTIFICATION_SOUND_PATH);
    audio.volume = 1.0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (ctx) {
          playSyntheticChime(ctx);
        }
      });
    }
  } catch {
    if (ctx) {
      playSyntheticChime(ctx);
    }
  }
};
