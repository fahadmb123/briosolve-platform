import type { ApplicationEvent } from "./application-event";

export interface IEventHandler<TEvent extends ApplicationEvent> {
    handle(event: TEvent): Promise<void>;
}