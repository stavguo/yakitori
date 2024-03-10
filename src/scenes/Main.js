import { addComponent, addEntity, createWorld } from "bitecs";
import { Scene } from "phaser";
import { Customer } from "../components/Customer.js";
import { Position } from "../components/Position.js";
import { Score } from "../components/Score.js";
import { Size } from "../components/Size.js";
import { Sprite } from "../components/Sprite.js";
import { Zone } from "../components/Zone.js";
import { createContainerSystem } from "../systems/ContainerSystem.js";
import { createCookingSystem } from "../systems/CookingSystem.js";
import { createCustomerSystem } from "../systems/CustomerSystem.js";
import { createOrderMovementSystem } from "../systems/OrderMovementSystem.js";
import { createScoreSystem } from "../systems/ScoreSystem.js";
import { createSkewerMovementSystem } from "../systems/SkewerMovementSystem.js";
import { createSpriteSystem } from "../systems/SpriteSystem.js";
import { createTextSystem } from "../systems/TextSystem.js";
import { createTimeSystem } from "../systems/TimeSystem.js";
import { createZoneSystem } from "../systems/ZoneSystem.js";

export class Main extends Scene {
  constructor() {
    super("Main");
  }

  create() {
    // Create globals
    this.world = createWorld({
      time: {
        delta: 0,
        then: performance.now(),
      },
    });
    this.gameObjectById = new Map();
    this.menuMap = this.cache.json.get("menu");
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

    const score = addEntity(this.world);
    addComponent(this.world, Score, score);
    addComponent(this.world, Position, score);
    Position.x[score] = 2;
    Position.y[score] = -3;

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
    this.timeSystem = createTimeSystem();
    this.containerSystem = createContainerSystem(this, this.gameObjectById);
    this.spriteSystem = createSpriteSystem(this, this.gameObjectById);
    this.textSystem = createTextSystem(this, this.gameObjectById);
    this.zoneSystem = createZoneSystem(this, this.gameObjectById);
    this.orderMovementSystem = createOrderMovementSystem(
      this,
      this.gameObjectById,
    );
    this.skewerMovementSystem = createSkewerMovementSystem(
      this,
      this.menuMap,
      this.gameObjectById,
    );
    this.customerSystem = createCustomerSystem();
    this.cookingSystem = createCookingSystem(
      this,
      this.menuMap,
      this.gameObjectById,
    );
    this.scoreSystem = createScoreSystem(this, this.gameObjectById);
  }

  update() {
    this.timeSystem(this.world);

    // GameObject-creating systems
    this.containerSystem(this.world);
    this.spriteSystem(this.world);
    this.textSystem(this.world);
    this.zoneSystem(this.world);

    // Drag and drop necessities
    this.orderMovementSystem(this.world);
    this.skewerMovementSystem(this.world);

    // Gameplay
    this.customerSystem(this.world);
    this.cookingSystem(this.world);
    this.scoreSystem(this.world);
    if (!this.world) {
      return;
    }
  }
}
