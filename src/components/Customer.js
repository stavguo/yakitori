import { GameObjects } from "phaser";
import { Skewer } from "./Skewer.js";

export class Customer extends GameObjects.Sprite {
  constructor(scene, posX, posY, texture, orders, emitter) {
    super(scene, posX, posY, texture);
    // Add to scene
    scene.add.existing(this);
    this.orderQueue = orders;
    this.totalOrders = orders.length;
    this.fulfilledOrders = 0;
    this.emitter = emitter;
    this.fingers = scene.add.sprite(posX, posY, "fingers", this.totalOrders);

    // Sprite Setup
    if (posX > 256 / 2) {
      this.flipX = true;
      this.fingers.flipX = true;
    }
    this.setInteractive({ draggable: true });
    this.setOrigin(0.5, 0.5);

    // Listener Setup
    this.emitter.on("orderTaken", this.orderTaken, this);
    this.emitter.on("orderFulfilled", this.orderFulfilled, this);
    this.on("dragstart", (pointer) => {
      if (this.orderQueue.length > 0) {
        this.newSkewer = new Skewer(
          scene,
          this,
          this.currentOrder(),
          pointer.x,
          pointer.y,
          emitter,
        );
        this.newSkewer.alpha = 0.5;
        this.newSkewer.setInteractive({ draggable: true });
        scene.input.setDraggable(this.newSkewer);
      }
    });
    this.on("drag", (pointer) => {
      if (this.newSkewer) {
        this.newSkewer.x = pointer.x;
        this.newSkewer.y = pointer.y;
        this.newSkewer.alpha = this.newSkewer.isSkewerPositionValid() ? 1 : 0.5;
      }
    });
    this.on("dragend", () => {
      if (this.newSkewer) {
        //  This will bring the selected gameObject to the top of the list
        if (this.newSkewer.isSkewerPositionValid()) {
          this.newSkewer.cook();
          this.emitter.emit("orderTaken", this.newSkewer.owner);
        } else {
          this.newSkewer.destroy();
        }
        this.newSkewer = null;
      }
    });
  }

  currentOrder() {
    if (this.orderQueue.length > 0) {
      return this.orderQueue[0];
    }
    return -1;
  }

  orderTaken(owner) {
    if (owner === this) {
      this.orderQueue.shift();
      this.fingers.setFrame(this.orderQueue.length);
    }
  }

  orderFulfilled(owner) {
    if (owner === this) {
      this.fulfilledOrders += 1;
      if (this.fulfilledOrders === this.totalOrders) {
        this.scene.availableSpots.push(this.x);
        this.fingers.destroy();
        this.destroy();
      }
    }
  }
}
