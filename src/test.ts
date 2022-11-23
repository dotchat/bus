import { IBusSubscriber } from "./interfaces";
import { bus } from "./index";

describe("should 'bus' be ok", () => {
  let subscriber: IBusSubscriber;

  test("should 'subscription' be ok", async () => {
    subscriber = bus.subscribe({
      subject: "test",
      callback: {
        next: (sub) => {
          sub.next("next");
          expect(sub.data).toBe("ok");
          expect(bus.subjects["test"].length).toBe(1);
        },
      },
    });
  }, 1000);

  test("should 'call' be ok", async () => {
    bus
      .call({
        subject: "test",
        param: "ok",
      })
      .subscribe({
        next: (sub) => {
          expect(sub.data).toBe("next");
        },
        complete: () => {
          expect("").toBe("");
        },
      });
  }, 1000);

  test("should 'unsubscribe' be ok", () => {
    setTimeout(() => {
      subscriber.unsubscribe();
      expect(bus.subjects["test"].length).toBe(0);
    }, 100);
  }, 1000);
});
