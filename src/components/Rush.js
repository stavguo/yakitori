import { Math, Utils } from "phaser";
import { Customer } from "./Customer.js";

export class Rush {
  constructor(
    scene,
    emitter,
    menu,
    minOrder,
    maxOrder,
    minCustomer,
    maxCustomer,
    minTime,
    maxTime,
  ) {
    this.emitter = emitter;
    this.minCustomer = minCustomer;
    this.maxCustomer = maxCustomer;
    this.minTime = minTime;
    this.maxTime = maxTime;
    this.scene = scene;
    this.availableSpots = [];
    for (let i = 16; i <= 256 - 16; i += 32) {
      this.availableSpots.push(i);
    }

    this.customerWave();
    this.emitter.on("leftSpot", this.addOpenSpot, this);
  }

  addCustomer() {
    Utils.Array.Shuffle(this.availableSpots);
    new Customer(
      this.scene,
      this.availableSpots.pop(),
      40,
      "customer1",
      [0, 0, 0],
      this.emitter,
    );
  }

  customerWave() {
    if (8 - this.availableSpots.length < this.maxCustomer) {
      this.addCustomer();
    } else {
      console.log("couldn't fit more customers");
    }

    this.scene.time.delayedCall(
      Math.Between(this.minTime, this.maxTime),
      () => this.customerWave(),
      this,
    );
  }

  addOpenSpot(xPos) {
    this.availableSpots.push(xPos);
    if (8 - this.availableSpots.length < this.minCustomer) {
      this.addCustomer();
    }
  }
}
