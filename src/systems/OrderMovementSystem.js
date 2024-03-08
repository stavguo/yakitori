import {
  addComponent,
  addEntity,
  defineQuery,
  defineSystem,
  enterQuery,
  hasComponent,
  removeEntity,
} from "bitecs";
import { Container } from "../components/Container.js";
import { Cooking } from "../components/Cooking.js";
import { Customer } from "../components/Customer.js";
import { DragAndDrop } from "../components/DragAndDrop.js";
import { Occupied } from "../components/Occupied.js";
import { Order } from "../components/Order.js";
import { PartOfContainer } from "../components/PartOfContainer.js";
import { Position } from "../components/Position.js";
import { Size } from "../components/Size.js";
import { Skewer } from "../components/Skewer.js";
import { Sprite } from "../components/Sprite.js";
import { Value } from "../components/Value.js";

const createSkewer = (world, zoneId) => {
  const skewer1 = addEntity(world);
  addComponent(world, Container, skewer1);
  addComponent(world, Cooking, skewer1);
  addComponent(world, Skewer, skewer1);
  Skewer.type[skewer1] = 0;
  Skewer.grillSlot[skewer1] = zoneId;
  addComponent(world, Position, skewer1);
  Position.x[skewer1] = Position.x[zoneId]; //24
  Position.y[skewer1] = Position.y[zoneId]; //56
  addComponent(world, Size, skewer1);
  Size.width[skewer1] = 16;
  Size.height[skewer1] = 80;
  addComponent(world, Value, skewer1);
  Value.amount[skewer1] = 100;
  addComponent(world, DragAndDrop, skewer1);

  const burnt = addEntity(world);
  addComponent(world, Position, burnt);
  Position.x[burnt] = -8; //24
  Position.y[burnt] = -40; //56
  addComponent(world, Sprite, burnt);
  Sprite.texture[burnt] = 6;
  Sprite.frame[burnt] = 0;
  addComponent(world, PartOfContainer, burnt);
  PartOfContainer.eid[burnt] = skewer1;

  const cooked = addEntity(world);
  addComponent(world, Position, cooked);
  Position.x[cooked] = -8; //24
  Position.y[cooked] = -40; //56
  addComponent(world, Sprite, cooked);
  Sprite.texture[cooked] = 5;
  Sprite.frame[cooked] = 0;
  addComponent(world, PartOfContainer, cooked);
  PartOfContainer.eid[cooked] = skewer1;

  const raw = addEntity(world);
  addComponent(world, Position, raw);
  Position.x[raw] = -8; //24
  Position.y[raw] = -40; //56
  addComponent(world, Sprite, raw);
  Sprite.texture[raw] = 4;
  Sprite.frame[raw] = 0;
  addComponent(world, PartOfContainer, raw);
  PartOfContainer.eid[raw] = skewer1;
};

export const createOrderMovementSystem = (scene, gameObjectById) => {
  const OrderQuery = defineQuery([DragAndDrop, Order]);
  const OrderQueryEnter = enterQuery(OrderQuery);
  return defineSystem((world) => {
    OrderQueryEnter(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      gameObject.setInteractive();
      scene.input.setDraggable(gameObject);
      if (scene.physics.world.drawDebug) {
        scene.input.enableDebug(gameObject);
      }
      gameObject.on("dragstart", () => {
        scene.children.bringToTop(gameObject);
      });
      gameObject.on("drag", (_, dragX, dragY) => {
        Position.x[eid] = Math.trunc(dragX);
        Position.y[eid] = Math.trunc(dragY);
      });
      gameObject.on("drop", (_, target) => {
        if (
          !hasComponent(world, Customer, target.name) &&
          !hasComponent(world, Occupied, target.name)
        ) {
          createSkewer(world, target.name);
          removeEntity(world, eid);
          addComponent(world, Occupied, target.name);
        }
      });
      gameObject.on("dragend", () => {
        Position.x[eid] = Math.trunc(gameObject.input.dragStartX);
        Position.y[eid] = Math.trunc(gameObject.input.dragStartY);
      });
    });
  });
};
