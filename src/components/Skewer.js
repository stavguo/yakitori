import { GameObjects, Scene } from "phaser";

export class Skewer extends GameObjects.Container {
  constructor(scene, owner, type, posX, posY, emitter) {
    super(scene, posX, posY);
    this.owner = owner;
    this.lastPos = { x: null, y: null };
    const skewerSprite = scene.add.image(0, 0, "skewer");
    this.add(skewerSprite);
    this.setSize(skewerSprite.width, skewerSprite.height);
    scene.physics.add.existing(this);

    this.emitter = emitter;
    scene.add.existing(this);
  }
}
