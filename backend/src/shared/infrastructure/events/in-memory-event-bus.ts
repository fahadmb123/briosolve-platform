import type { ApplicationEvent } from "../../application/events/application-event";
import type { IEventBus } from "../../application/events/event-bus.interface";
import type { IEventHandler } from "../../application/events/event-handler.interface";

type RegisteredHandler = (event: ApplicationEvent) => Promise<void>

export class InMemoryEventBus implements IEventBus {
    private readonly handlers = new Map<string,RegisteredHandler[]>()

    subscribe<TEvent extends ApplicationEvent>(eventName: TEvent["eventName"],handler: IEventHandler<TEvent>): void {
        const registeredHandlers = this.handlers.get(eventName) ?? [];

        registeredHandlers.push(async (event) => {
            await handler.handle(event as TEvent);
        })

        this.handlers.set(eventName, registeredHandlers);
    }

    async publish(event: ApplicationEvent): Promise<void> {
        const registeredHandlers = this.handlers.get(event.eventName) ?? [];

        await Promise.all(
            registeredHandlers.map((handler) => handler(event)),
        )
    }
}