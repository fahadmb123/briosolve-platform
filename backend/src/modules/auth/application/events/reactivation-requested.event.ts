import type { ApplicationEvent } from "../../../../shared/application/events/application-event";

export class ReactivationRequestedEvent implements ApplicationEvent {
    readonly eventName = "reactivation.requested"
    readonly occurredAt: Date

    constructor(
        public readonly requestId: string,
        public readonly userId: string,
        occurredAt: Date = new Date(),
    ) {this.occurredAt = occurredAt}
}