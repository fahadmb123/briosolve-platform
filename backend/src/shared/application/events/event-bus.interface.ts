import type { ApplicationEvent } from "./application-event";
import type { IEventHandler } from "./event-handler.interface";

export interface IEventBus {
    subscribe<TEvent extends ApplicationEvent>(
        eventName: TEvent["eventName"],
        handler: IEventHandler<TEvent>,
    ): void;

    publish(event: ApplicationEvent): Promise<void>;
}