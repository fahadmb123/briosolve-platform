export class PresenceTracker {
    private static readonly userSockets = new Map<string, Set<string>>();

    static isOnline(userId: string): boolean {
        const id = String(userId).trim();
        return (this.userSockets.get(id)?.size ?? 0) > 0;
    }

    static add(userId: string, socketId: string): boolean {
        const id = String(userId).trim();
        let set = this.userSockets.get(id);
        if (!set) {
            set = new Set();
            this.userSockets.set(id, set);
        }
        const wasEmpty = set.size === 0;
        set.add(socketId);
        return wasEmpty;
    }

    static remove(userId: string, socketId: string): boolean {
        const id = String(userId).trim();
        const set = this.userSockets.get(id);
        if (!set) return false;
        set.delete(socketId);
        if (set.size === 0) {
            this.userSockets.delete(id);
            return true;
        }
        return false;
    }

    static setOffline(userId: string): boolean {
        const id = String(userId).trim();
        const existed = this.userSockets.has(id);
        this.userSockets.delete(id);
        return existed;
    }
}
