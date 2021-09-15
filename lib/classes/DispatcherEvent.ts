export class DispatcherEvent {

  public eventName: string;
  public callbacks: ((...args: any[]) => void)[];

  constructor(eventName: string) {
    this.eventName = eventName;
    this.callbacks = [];
  }

  registerCallback(callback: (...args: any[]) => void) {
    this.callbacks.push(callback);
  }

  unregisterCallback(callback: (...args: any[]) => void) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  fire(...args: any[]) {
    const callbacks = this.callbacks.slice(0);
    callbacks.forEach((callback) => {
      callback(...args);
    });
  }
}
