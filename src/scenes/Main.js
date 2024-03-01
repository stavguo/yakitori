import { addComponent, addEntity, createWorld } from "bitecs";
import { Scene } from "phaser";
import { Container } from "../components/Container.js";
import { Draggable } from "../components/Draggable.js";
import { Droppable } from "../components/Droppable.js";
import { Interactive } from "../components/Interactive.js";
import { MenuText } from "../components/MenuText.js";
import { Order } from "../components/Order.js";
import { PartOfContainer } from "../components/PartOfContainer.js";
import { Position } from "../components/Position.js";
import { Returnable } from "../components/Returnable.js";
import { Size } from "../components/Size.js";
import { Sprite } from "../components/Sprite.js";
import { Zone } from "../components/Zone.js";
import { createAddToContainerSystem } from "../systems/AddToContainerSystem.js";
import { createContainerSystem } from "../systems/ContainerSystem.js";
import { createDragSystem } from "../systems/DragSystem.js";
import { createDropSystem } from "../systems/DropSystem.js";
import { createReturnSystem } from "../systems/ReturnSystem.js";
import { createSetInteractiveSystem } from "../systems/SetInteractiveSystem.js";
import { createSpriteSystem } from "../systems/SpriteSystem.js";
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

    const customer1 = addEntity(this.world);
    addComponent(this.world, Position, customer1);
    Position.x[customer1] = 24;
    Position.y[customer1] = 24;
    addComponent(this.world, Sprite, customer1);
    Sprite.texture[customer1] = 1;
    Sprite.frame[customer1] = 0;

    const order1 = addEntity(this.world);
    addComponent(this.world, Order, order1);
    addComponent(this.world, Container, order1);
    addComponent(this.world, Position, order1);
    Position.x[order1] = 24 + 16;
    Position.y[order1] = 16 + 6;
    addComponent(this.world, Size, order1);
    Size.width[order1] = 32;
    Size.height[order1] = 12;
    addComponent(this.world, Interactive, order1);
    addComponent(this.world, Draggable, order1);
    addComponent(this.world, Droppable, order1);
    addComponent(this.world, Returnable, order1);

    const speechBubble1 = addEntity(this.world);
    addComponent(this.world, Position, speechBubble1);
    Position.x[speechBubble1] = -16;
    Position.y[speechBubble1] = -6;
    addComponent(this.world, Sprite, speechBubble1);
    Sprite.texture[speechBubble1] = 2;
    Sprite.frame[speechBubble1] = 0;
    addComponent(this.world, PartOfContainer, speechBubble1);
    PartOfContainer.eid[speechBubble1] = order1;

    const orderText1 = addEntity(this.world);
    addComponent(this.world, Position, orderText1);
    Position.x[orderText1] = 3 - 16;
    Position.y[orderText1] = -4 - 6;
    addComponent(this.world, MenuText, orderText1);
    MenuText.item[orderText1] = 0;
    MenuText.field[orderText1] = 0;
    addComponent(this.world, PartOfContainer, orderText1);
    PartOfContainer.eid[orderText1] = order1;

    // Create Systems
    this.spriteSystem = createSpriteSystem(this, this.gameObjectById);
    this.containerSystem = createContainerSystem(this, this.gameObjectById);
    this.addToContainerSystem = createAddToContainerSystem(
      this,
      this.gameObjectById,
    );
    this.zoneSystem = createZoneSystem(this, this.gameObjectById);
    this.interactiveSystem = createSetInteractiveSystem(
      this,
      this.gameObjectById,
    );
    this.dragSystem = createDragSystem(this, this.gameObjectById);
    this.returnSystem = createReturnSystem(this, this.gameObjectById);
    this.dropSystem = createDropSystem(this, this.gameObjectById);
  }

  update(t, dt) {
    // GameObject-creating systems
    this.spriteSystem(this.world);
    this.containerSystem(this.world);
    this.addToContainerSystem(this.world);
    this.zoneSystem(this.world);

    // Drag and drop necessities
    this.interactiveSystem(this.world);
    this.dragSystem(this.world);
    this.returnSystem(this.world);
    this.dropSystem(this.world);
    if (!this.world) {
      return;
    }
  }
}
