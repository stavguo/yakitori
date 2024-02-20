import { Events, Geom, Scene } from "phaser";
import { Customer } from "../components/Customer.js";
import { Rush } from "../components/Rush.js";
import { Skewer } from "../components/Skewer.js";

export class Grill extends Scene {
  constructor() {
    super("Grill");
  }

  create() {
    // Events
    {
      this.emitter = new Events.EventEmitter();
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
      this.graphics = this.add.graphics({
        fillStyle: { color: 0x0000aa },
        lineStyle: { color: 0xaa0000 },
      });
      //this.graphics.strokeRectShape(customer.getBounds());
    }

    // Game loop
    {
      new Rush(this, this.emitter, this.menuMap, 1, 3, 1, 5, 10000, 30000);
    }

    // Set up drag listeners
    this.input.on(
      "dragstart",
      function (pointer, gameObject) {
        if (gameObject instanceof Skewer) {
          //  This will bring the selected gameObject to the top of the list
          this.children.bringToTop(gameObject);
          gameObject.lastPos = { x: gameObject.x, y: gameObject.y };
        } else if (gameObject instanceof Customer && this.newSkewer) {
          this.newSkewer.x = pointer.x;
          this.newSkewer.y = pointer.y;
          this.newSkewer.setInteractive({ draggable: true });
          this.input.setDraggable(this.newSkewer);
        }
      },
      this,
    );
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if (gameObject instanceof Customer) {
        if (!this.newSkewer) {
          return;
        }
        gameObject = this.newSkewer;
        gameObject.x = pointer.x;
        gameObject.y = pointer.y;
      } else {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
      gameObject.alpha = this.isSkewerPositionValid(gameObject) ? 1 : 0.5;
    });
    this.input.on(
      "dragend",
      function (pointer, gameObject) {
        if (gameObject instanceof Skewer) {
          //  This will bring the selected gameObject to the top of the list
          if (
            Geom.Rectangle.Contains(
              gameObject.owner.getBounds(),
              gameObject.x,
              gameObject.y,
            )
          ) {
            this.emitter.emit("orderFulfilled", gameObject.owner);
            gameObject.destroy();
          } else if (!this.isSkewerPositionValid(gameObject)) {
            gameObject.x = gameObject.lastPos.x;
            gameObject.y = gameObject.lastPos.y;
          }
          gameObject.alpha = 1;
        } else if (gameObject instanceof Customer && this.newSkewer) {
          //  This will bring the selected gameObject to the top of the list
          if (this.isSkewerPositionValid(this.newSkewer)) {
            gameObject.alpha = 1;
            this.emitter.emit("orderTaken", this.newSkewer.owner);
          } else {
            this.newSkewer.destroy();
          }
          this.newSkewer = null;
        }
      },
      this,
    );
  }

  isSkewerPositionValid(skewer) {
    // TODO: Clean this up
    const skewerRect = new Geom.Rectangle(
      skewer.x - skewer.width / 2,
      skewer.y - (skewer.height - 14) / 2,
      skewer.width,
      skewer.height - 14,
    );
    // this.graphics.strokeRectShape(skewerRect);
    const grillRect = new Geom.Rectangle(
      this.grill.x - this.grill.width / 2,
      this.grill.y - this.grill.height / 2,
      this.grill.width,
      this.grill.height,
    );
    // this.graphics.strokeRectShape(grillRect);
    const selected = this.physics.overlapRect(
      skewerRect.x,
      skewerRect.y,
      skewerRect.width,
      skewerRect.height,
    );
    return (
      Geom.Rectangle.ContainsRect(grillRect, skewerRect) &&
      selected.length === 1
    );
  }
}
