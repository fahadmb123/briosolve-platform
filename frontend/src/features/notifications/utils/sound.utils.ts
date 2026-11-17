const NOTIFICATION_SOUND_PATH = "/sounds/notification.mp3";

let hasUnlocked = false;

const unlockAudio = (): void => {
  if (hasUnlocked) return;
  hasUnlocked = true;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const dummyCtx = new AudioCtx();
      if (dummyCtx.state === "suspended") {
        dummyCtx.resume().catch(() => {});
      }
      setTimeout(() => {
        dummyCtx.close().catch(() => {});
      }, 150);
    }
  } catch {
    return;
  }

  if (typeof window !== "undefined") {
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
  window.addEventListener("click", unlockAudio, { once: true, passive: true });
  window.addEventListener("keydown", unlockAudio, { once: true, passive: true });
  window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
}

const playSyntheticChime = (): void => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
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

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 550);
  } catch {
    return;
  }
};

export const playNotificationSound = (): void => {
  if (typeof window === "undefined" || typeof Audio === "undefined") return;

  try {
    const audio = new Audio(NOTIFICATION_SOUND_PATH);
    audio.preload = "auto";
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
