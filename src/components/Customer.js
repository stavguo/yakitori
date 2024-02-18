import { GameObjects } from "phaser";

export class Customer extends GameObjects.Sprite {
  constructor(scene, posX, posY, texture, orders, emitter) {
    super(scene, posX, posY, texture);
    if (posX > 256 / 2) {
      this.flipX = true;
    }
    this.setInteractive({ draggable: true });
    this.setOrigin(0.5, 0.5);
    this.orders = orders;

    // Listener Setup
    this.emitter = emitter;
    this.emitter.on("orderTaken", this.orderTaken, this);
    this.on(
      "pointerover",
      () => {
        this.emitter.emit("cursorOverCustomer", true, this);
      },
      this,
    );
    this.on(
      "pointerout",
      () => {
        this.emitter.emit("cursorOverCustomer", false, this);
      },
      this,
    );
    scene.add.existing(this);
  }

  currentOrder() {
    if (this.orders.length > 0) {
      return this.orders[0];
    }
    return -1;
  }

  orderTaken(owner) {
    if (owner === this) {
      this.orders.shift();
    }
  }
}
