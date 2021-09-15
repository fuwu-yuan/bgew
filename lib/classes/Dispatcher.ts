import {DispatcherEvent} from "./DispatcherEvent";

export class Dispatcher {

  public events: { [key: string]: DispatcherEvent;};

  constructor() {
    this.events = {};
  }

  dispatch(eventName: string, ...args: any[]) {
    const event = this.events[eventName];
    if (event) {
      event.fire(...args);
    }
    const all = this.events["all"];
    if (all) {
      all.fire(...args);
    }
  }

  on(eventName: string, callback: (...args: any[]) => void) {
    let event = this.events[eventName];
    if (!event) {
      event = new DispatcherEvent(eventName);
      this.events[eventName] = event;
    }
    event.registerCallback(callback);
  }

  off(eventName: string, callback: (...args: any[]) => void) {
    const event = this.events[eventName];
    if (event && event.callbacks.indexOf(callback) > -1) {
      event.unregisterCallback(callback);
      if (event.callbacks.length === 0) {
        delete this.events[eventName];
      }
    }
  }
}
