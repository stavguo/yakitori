import { GameObjects, Geom, Utils } from "phaser";

export class Skewer extends GameObjects.Container {
  constructor(scene, owner, type, posX, posY, emitter) {
    super(scene, posX, posY);
    this.scene = scene;
    this.owner = owner;
    this.type = type;
    this.emitter = emitter;
    this.lastPos = { x: null, y: null };
    this.cookTween = null;
    this.ingredientData = scene.cache.json.get("ingredients");

    // Sprite Setup
    this.createSkewer();

    // Listener Setup
    this.on("pointerdown", () => {
      if (this.cookTween !== null) this.cookTween.pause();
    });
    this.on("pointerup", () => {
      if (this.cookTween !== null) this.cookTween.resume();
    });
    this.on("dragstart", () => {
      this.scene.children.bringToTop(this);
      this.lastPos = { x: this.x, y: this.y };
      this.owner.fingers.setVisible(true);
      this.owner.fingers.setFrame(5);
    });
    this.on("drag", (_, dragX, dragY) => {
      this.x = dragX;
      this.y = dragY;
      this.alpha = this.isSkewerPositionValid() ? 1 : 0.5;
    });
    this.on("dragend", () => {
      if (Geom.Rectangle.Contains(this.owner.getBounds(), this.x, this.y)) {
        this.emitter.emit("orderFulfilled", this.owner);
        this.destroy();
      } else if (!this.isSkewerPositionValid()) {
        this.x = this.lastPos.x;
        this.y = this.lastPos.y;
      }
      this.alpha = 1;
      this.owner.fingers.setVisible(false);
      this.owner.fingers.setFrame(this.owner.orderQueue.length);
    });

    // Add to scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
  }

  cook() {
    // Loop over last couple sprites in container
    this.cookTween = this.scene.add.tween({
      targets: this.list[this.list.length - 1],
      alpha: { value: 0, duration: this.type.cookTime, ease: "Power1" },
      repeat: 0,
      onComplete: () => {
        this.cookTween = this.scene.add.tween({
          targets: this.list[this.list.length - 2],
          alpha: { value: 0, duration: this.type.burnTime, ease: "Power1" },
          repeat: 0,
          onComplete: () => {
            this.cookTween = null;
          },
        });
      },
    });
  }

  createSkewer() {
    const skewerSprite = this.scene.add.sprite(0, 0, "skewer");
    this.add(skewerSprite);
    const randomFrames = Utils.Array.Shuffle([0, 1, 2]);
    ["burnt", "cooked", "raw"].forEach((state) => {
      const container = this.scene.add.container(0, 0);
      this.type["ingredients"].forEach((ingred, index) => {
        const rawTexture = this.ingredientData[ingred["texture"]][state];
        const ingredSprite = this.scene.add.sprite(
          0,
          ingred["yPos"],
          rawTexture,
          randomFrames[index],
        );
        container.add(ingredSprite);
      });
      this.add(container);
    });
    this.setSize(skewerSprite.width, skewerSprite.height);
  }

  isSkewerPositionValid() {
    // TODO: Clean this up
    const skewerRect = new Geom.Rectangle(
      this.x - this.width / 2,
      this.y - (this.height - 14) / 2,
      this.width,
      this.height - 14,
    );
    // this.graphics.strokeRectShape(skewerRect);
    const grillRect = new Geom.Rectangle(
      this.scene.grill.x - this.scene.grill.width / 2,
      this.scene.grill.y - this.scene.grill.height / 2,
      this.scene.grill.width,
      this.scene.grill.height,
    );
    // this.graphics.strokeRectShape(grillRect);
    const selected = this.scene.physics.overlapRect(
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
