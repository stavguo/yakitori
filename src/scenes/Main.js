import { addComponent, addEntity, createWorld } from "bitecs";
import { Scene } from "phaser";
import { Customer } from "../components/Customer.js";
import { Position } from "../components/Position.js";
import { Size } from "../components/Size.js";
import { Sprite } from "../components/Sprite.js";
import { Zone } from "../components/Zone.js";
import { createContainerSystem } from "../systems/ContainerSystem.js";
import { createCustomerSystem } from "../systems/CustomerSystem.js";
import { createDragSystem } from "../systems/DragSystem.js";
import { createDropSystem } from "../systems/DropSystem.js";
import { createReturnSystem } from "../systems/ReturnSystem.js";
import { createSetInteractiveSystem } from "../systems/SetInteractiveSystem.js";
import { createSpriteSystem } from "../systems/SpriteSystem.js";
import { createTextSystem } from "../systems/TextSystem.js";
import { createZoneSystem } from "../systems/ZoneSystem.js";

export class Main extends Scene {
  constructor() {
    super("Main");
  }

  create() {
    // Create globals
    this.world = createWorld();
    this.gameObjectById = new Map();

    this.graphics = this.add.graphics({
      fillStyle: { color: 0x0000aa },
      lineStyle: { color: 0xaa0000 },
    });

    // Create Entities
    const grill = addEntity(this.world);
    addComponent(this.world, Position, grill);
    Position.x[grill] = 0;
    Position.y[grill] = 56;
    addComponent(this.world, Sprite, grill);
    Sprite.texture[grill] = 0;
    Sprite.frame[grill] = 0;

    // Make grill slot entities
    for (let i = 0; i < 256; i += 16) {
      // Sprite
      if (this.physics.world.drawDebug) {
        const crosshair1 = addEntity(this.world);
        addComponent(this.world, Position, crosshair1);
        Position.x[crosshair1] = i; // 112
        Position.y[crosshair1] = 56 + 32;
        addComponent(this.world, Sprite, crosshair1);
        Sprite.texture[crosshair1] = 3;
        Sprite.frame[crosshair1] = 0;
      }

      // Zone (eid)
      const zone1 = addEntity(this.world);
      addComponent(this.world, Zone, zone1);
      addComponent(this.world, Position, zone1);
      Position.x[zone1] = i + 8; // 112 + 8
      Position.y[zone1] = 56 + 40;
      addComponent(this.world, Size, zone1);
      Size.width[zone1] = 16;
      Size.height[zone1] = 80;
    }

    const customer = addEntity(this.world);
    addComponent(this.world, Customer, customer);

    // Create Systems
    this.containerSystem = createContainerSystem(this, this.gameObjectById);
    this.spriteSystem = createSpriteSystem(this, this.gameObjectById);
    this.textSystem = createTextSystem(this, this.gameObjectById);
    this.zoneSystem = createZoneSystem(this, this.gameObjectById);
    this.interactiveSystem = createSetInteractiveSystem(
      this,
      this.gameObjectById,
    );
    this.dragSystem = createDragSystem(this, this.gameObjectById);
    this.returnSystem = createReturnSystem(this, this.gameObjectById);
    this.dropSystem = createDropSystem(this, this.gameObjectById);
    this.customerSystem = createCustomerSystem(this, this.gameObjectById);
  }

  update(t, dt) {
    // GameObject-creating systems
    this.containerSystem(this.world);
    this.spriteSystem(this.world);
    this.textSystem(this.world);
    this.zoneSystem(this.world);

    // Drag and drop necessities
    this.interactiveSystem(this.world);
    this.dragSystem(this.world);
    this.returnSystem(this.world);
    this.dropSystem(this.world);

    // Gameplay
    this.customerSystem(this.world);
    if (!this.world) {
      return;
    }
  }
}
