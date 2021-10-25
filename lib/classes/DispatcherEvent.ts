import {DispatcherOptions} from "./Dispatcher";

export class DispatcherEvent {

  public eventName: string;
  public callbacks: {
    callback: ((...args: any[]) => void),
    options: DispatcherOptions
  }[];

  constructor(eventName: string) {
    this.eventName = eventName;
    this.callbacks = [];
  }

  registerCallback(callback: (...args: any[]) => void, options: DispatcherOptions = {once: false}) {
    this.callbacks.push({callback: callback, options: options});
  }

  unregisterCallback(callback: (...args: any[]) => void) {
    const index = this.callbacks.findIndex((e) => {
      return e.callback === callback;
    });
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  fire(...args: any[]) {
    /*const callbacks = this.callbacks.slice(0);
    callbacks.forEach((callback) => {
      callback.callback(...args);
    });*/
    this.callbacks = this.callbacks.filter((c) => {
      c.callback(...args);
      return c.options.once === false;
    });
  }
}
