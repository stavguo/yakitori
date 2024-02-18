import { GameObjects } from "phaser";
import { Skewer } from "./Skewer.js";

export class Customer extends GameObjects.Sprite {
  constructor(scene, posX, posY, texture, orders, emitter) {
    super(scene, posX, posY, texture);
    this.scene;
    this.orders = orders;
    this.emitter = emitter;

    // Sprite Setup
    if (posX > 256 / 2) {
      this.flipX = true;
    }
    this.setInteractive({ draggable: true });
    this.setOrigin(0.5, 0.5);

    // Listener Setup
    this.emitter.on("orderTaken", this.orderTaken, this);
    this.on("pointerover", () => this.cursorOverCustomer(true));
    this.on("pointerout", () => this.cursorOverCustomer(false));
    scene.add.existing(this);
  }

  cursorOverCustomer(isOver) {
    if (isOver && this.orders.length > 0) {
      this.scene.newSkewer = new Skewer(
        this.scene,
        this,
        this.currentOrder(),
        this.x,
        this.y,
        this.emitter,
      );
      this.scene.newSkewer.alpha = 0.5;
    } else if (!isOver && this.orders.length > 0) {
      if (this.scene.newSkewer) {
        this.scene.newSkewer.destroy();
        this.scene.newSkewer = null;
      }
    }
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
