// TODO: rewrite this shitty class later

export type EventDelegatorEventMap = keyof HTMLElementEventMap;

type EventDelegatorHandlerFn<E extends HTMLElement> = (element: E) => void;

type EventDelegatorListener<E extends HTMLElement> = {
  className: string;
  handler: EventDelegatorHandlerFn<E>;
};

type EventDelegatorListeners<E extends HTMLElement> = {
  [K in keyof HTMLElementEventMap]?: EventDelegatorListener<E>[];
};

type EventDelegatorHandler = (event: MouseEvent) => void;

type EventDelegatorHandlers = {
  [key: string]: EventDelegatorHandler;
};

export default class EventDelegator<
  K extends EventDelegatorEventMap,
  E extends HTMLElement
> {
  constructor(
    private element: E,
    private listeners: EventDelegatorListeners<E> = {},
    private eventHandlers: EventDelegatorHandlers = {}
  ) {
    this.listeners = listeners;
  }

  private createEventHandler(listeners: EventDelegatorListener<E>[]) {
    return (event: HTMLElementEventMap[K]) => {
      const targetElement = event.target as E | null;
      if (targetElement == null) return;

      for (const listener of listeners) {
        if (targetElement.classList.contains(listener.className)) {
          listener.handler(targetElement);
        }
      }
    };
  }

  public addListener(
    className: string,
    eventType: K,
    handler: EventDelegatorHandlerFn<any>
  ) {
    if (this.listeners[eventType] == null) {
      this.listeners[eventType] = [];
    }

    this.listeners[eventType].push({ className, handler });
  }

  public start() {
    for (const [eventType, eventListeners] of Object.entries(this.listeners)) {
      if (eventListeners) {
        const eventHandler = this.createEventHandler(eventListeners);
        this.element.addEventListener(eventType as K, eventHandler);

        this.eventHandlers[eventType] = eventHandler as EventDelegatorHandler;
      }
    }
  }

  public stop() {
    for (const [eventType, eventHandler] of Object.entries(this.eventHandlers))
      this.element.removeEventListener(
        eventType as K,
        eventHandler as (this: HTMLElement, ev: HTMLElementEventMap[K]) => void
      );
  }

  public getElement(): E {
    return this.element;
  }

  public setElement(element: E) {
    this.element = element;
  }
}
