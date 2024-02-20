import { GameObjects, Geom, Scene } from "phaser";

export class Skewer extends GameObjects.Container {
  constructor(scene, owner, type, posX, posY, emitter) {
    super(scene, posX, posY);
    this.scene = scene;
    this.owner = owner;
    this.lastPos = { x: null, y: null };
    const skewerSprite = scene.add.image(0, 0, "skewer");
    this.add(skewerSprite);
    this.setSize(skewerSprite.width, skewerSprite.height);
    scene.physics.add.existing(this);

    this.emitter = emitter;
    scene.add.existing(this);
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
