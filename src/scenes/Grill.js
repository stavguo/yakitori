import { Events, Math, Scene, Utils } from "phaser";
import { Customer } from "../components/Customer.js";

export class Grill extends Scene {
  constructor() {
    super("Grill");
  }

  preload() {
    // Data
    this.menu = this.cache.json.get("menu");
    // Animations
    this.anims.create({
      key: "thigh_raw",
      frames: this.anims.generateFrameNumbers("thigh_raw", {
        start: 0,
        end: 2,
      }),
    });
    this.anims.create({
      key: "fingers",
      frames: this.anims.generateFrameNumbers("fingers", {
        start: 0,
        end: 4,
      }),
    });
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

    // Scene Setup
    {
      this.grill = this.add
        .image(128, 96, "grill")
        .setOrigin(0.5, 0.5)
        .setInteractive();
      this.grill.on("pointerover", () => {
        this.emitter.emit("pointeroutCustomerZone");
      });
      const customerZone = this.add
        .zone(128, 28, 256, 56)
        .setOrigin(0.5)
        .setInteractive();
      customerZone.on("pointerover", () =>
        this.emitter.emit("pointeroverCustomerZone"),
      );
      // this.graphics = this.add.graphics({
      //   fillStyle: { color: 0x0000aa },
      //   lineStyle: { color: 0xaa0000 },
      // });
      //this.graphics.strokeRectShape(customer.getBounds());
      this.addMultipleCustomers();
    }

    // UI Setup
    {
      this.ui = this.add.bitmapText(2, -3, "eighties", `$${123456789}`, 12);
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
      [this.menu["momo"], this.menu["momo"], this.menu["momo"]],
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
