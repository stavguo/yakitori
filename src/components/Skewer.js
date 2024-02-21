import { GameObjects, Geom, Scene } from "phaser";

export class Skewer extends GameObjects.Container {
  constructor(scene, owner, type, posX, posY, emitter) {
    super(scene, posX, posY);
    this.scene = scene;
    this.owner = owner;
    this.emitter = emitter;
    this.lastPos = { x: null, y: null };

    // Sprite Setup
    const skewerSprite = this.scene.add.image(0, 0, "skewer");
    this.add(skewerSprite);
    this.setSize(skewerSprite.width, skewerSprite.height);

    // Listener Setup
    this.on("dragstart", () => {
      this.scene.children.bringToTop(this);
      this.lastPos = { x: this.x, y: this.y };
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
    });

    // Add to scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
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
