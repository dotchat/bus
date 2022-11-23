import {
    IBusCall,
    IBusSubjectMap,
    IBusSubscriber,
    IBusSubscription,
    IBusSubscriptionCallback,
    IBusUseSubjectMap,
  } from "./interfaces";
  
  export const uuid = () => {
    var d = new Date().getTime(); //Timestamp
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  };
  
  class Bus {
    // map of subjects with their callbacks
    public readonly subjects: IBusSubjectMap = {};
  
    /**
     * Subscribe to a subject
     * @param param Subscribe to a subject with start, next, error, complete callbacks
     */
    public subscribe(param: IBusSubscription): IBusSubscriber {
      // generate random id for subscription
      const id = this.randomId();
      // make an empty array if subject not exists
      if (this.subjects[param.subject] == undefined) {
        this.subjects[param.subject] = [];
      }
      // push callback
      this.subjects[param.subject].push({
        id: id,
        once: param.once == true,
        started: false,
        callback: param.callback,
      });
  
      return {
        // unsubscribe
        unsubscribe: () => {
          const index = this.subjects[param.subject].findIndex(
            (item) => item.id == id
          );
          if (index != -1) {
            this.subjects[param.subject].splice(index, 1);
          }
        },
      };
    }
  
    /**
     * Call a subscriber
     * @param param Call a subscriber with subject and some data
     * @returns Call and subscribe for results
     */
    public call(param: IBusCall) {
      const id = param.id ?? this.randomId();
      this.fire(param, id);
  
      return {
        id: id,
        // subscribe for back results
        subscribe: (callback: IBusSubscriptionCallback) => {
          return this.subscribe({
            subject: `${param.subject}/back/${id}`,
            once: true,
            callback: callback,
          });
        },
      };
    }
  
    /**
     * Call a subjecriber
     * @param param Call a subjecriber with subject and some data
     * @param id Random generated id for back result
     */
    private fire(param: IBusCall, id?: string) {
      const subject = this.subjects[param.subject];
      if (subject) {
        subject.forEach((item, index) => {
          const { start, next, error, complete } = item.callback;
          // remove callback if no callback exists
          if (Object.keys(item.callback).length == 0) {
            subject.splice(index, 1);
            return;
          }
          // start callback if not started
          if (item.started == false && start) {
            item.started = true;
            start();
          }
  
          // execute next function if call type was next or noting
          if (next && (param.type == "next" || param.type == undefined)) {
            this.fireCallback(next, param, id);
          }
  
          // execute error function if call type was error
          if (error && param.type == "error") {
            this.fireCallback(error, param, id);
          }
  
          // execute complete function if call type was complete
          if (complete && param.type == "complete") {
            complete();
            if (item.once == false) {
              // bye bye callback
              subject.splice(index, 1);
            }
          }
  
          // remove callback that use for once
          if (item.once) {
            // execute complete for once and last time
            if (complete && param.type != "complete") {
              complete();
            }
            // bye bye callback
            subject.splice(index, 1);
            // remove from subject map
            if (id == undefined && subject.length == 0) {
              delete this.subjects[param.subject];
            }
          }
        });
      }
    }
  
    /**
     * Execute a callback function
     * @param func 'next' or 'error' callback function
     * @param param Call a subscriber with subject and some data
     * @param id Random generated id for back result
     */
    private fireCallback(func: any, param: IBusCall, id?: string) {
      func({
        data: param.param,
        next: (value: any) => {
          if (id) {
            this.call({
              subject: `${param.subject}/back/${id}`,
              param: value,
              type: "next",
            });
          }
        },
        error: (value: any) => {
          if (id) {
            this.call({
              subject: `${param.subject}/back/${id}`,
              param: value,
              type: "error",
            });
          }
        },
        complete: () => {
          if (id) {
            this.call({
              subject: `${param.subject}/back/${id}`,
              type: "complete",
            });
          }
        },
      });
    }
  
    /**
     * Generate a random id for back result or subscription id
     * @returns Random string for id
     */
    private randomId(): string {
      return uuid();
    }
  }
  
  export const bus = new Bus();
  
  export const useBus = (subject: IBusUseSubjectMap) => {
    Object.keys(subject).forEach((key: string) => {
      bus.subscribe({
        subject: key,
        callback: {
          next: subject[key],
        },
      });
    });
  };
  
  export default bus;
  