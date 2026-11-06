const CHAT_RECIEVE_SOUND_PATH = "/sounds/chat-recieve.mp3";
const CHAT_SEND_SOUND_PATH = "/sounds/chat-send.mp3";
const MESSAGE_SOUND_PATH = "/sounds/message.mp3";

const playAudio = (path: string): void => {
    if (typeof Audio === "undefined") return;
    try {
        const audio = new Audio(path);
        audio.play().catch(() => {});
    } catch {
        return;
    }
};

export const playChatRecieveSound = (): void => {
    playAudio(CHAT_RECIEVE_SOUND_PATH);
};

export const playChatSendSound = (): void => {
    playAudio(CHAT_SEND_SOUND_PATH);
};

export const playMessageSound = (): void => {
    playAudio(MESSAGE_SOUND_PATH);
};
