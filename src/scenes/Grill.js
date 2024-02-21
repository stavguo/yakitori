import { Events, Math, Scene, Utils } from "phaser";
import { Customer } from "../components/Customer.js";

export class Grill extends Scene {
  constructor() {
    super("Grill");
  }

  create() {
    // Events
    {
      this.emitter = new Events.EventEmitter();
      this.maxCustomers = 5;
      this.minTime = 5000;
      this.maxTime = 15000;
      this.timeUntilNextCustomer = Math.Between(this.minTime, this.maxTime);
      const range = (start, stop, step) =>
        Array.from(
          { length: (stop - start) / step + 1 },
          (_, i) => start + i * step,
        );
      this.availableSpots = range(16, 256 - 16, 32);
    }

    // Menu and Ingredients
    {
      this.ingredientList = [
        {
          // 0
          name: "raw chicken ball",
          texture: "raw",
          height: 16,
        },
      ];
      this.menuObject = {
        0: {
          name: "test",
          ingredients: [
            this.ingredientList[0],
            this.ingredientList[0],
            this.ingredientList[0],
          ],
        },
      };
      this.menuMap = new Map(Object.entries(this.menuObject));
    }

    // Scene Setup
    {
      this.grill = this.add.image(128, 96, "grill").setOrigin(0.5, 0.5);
      // this.graphics = this.add.graphics({
      //   fillStyle: { color: 0x0000aa },
      //   lineStyle: { color: 0xaa0000 },
      // });
      //this.graphics.strokeRectShape(customer.getBounds());
      this.addMultipleCustomers();
    }
  }

  update(t, dt) {
    this.timeUntilNextCustomer -= dt;
    if (this.timeUntilNextCustomer < 0) {
      this.timeUntilNextCustomer = Math.Between(this.minTime, this.maxTime);
      if (8 - this.availableSpots.length < this.maxCustomers) {
        this.addCustomer();
      }
    }
    if (this.availableSpots.length == 8) {
      this.addMultipleCustomers();
    }
  }

  addCustomer() {
    Utils.Array.Shuffle(this.availableSpots);
    new Customer(
      this,
      this.availableSpots.pop(),
      40,
      "customer1",
      [0, 0, 0],
      this.emitter,
    );
  }

  addMultipleCustomers() {
    const startingCustomers = Math.Between(1, this.maxCustomers);
    for (let i = 0; i < startingCustomers; i++) {
      this.addCustomer();
    }
  }
}
