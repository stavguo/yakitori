import {
  addComponent,
  addEntity,
  defineQuery,
  defineSystem,
  enterQuery,
  exitQuery,
  hasComponent,
  removeComponent,
  removeEntity,
} from "bitecs";
import { Customer } from "../components/Customer.js";
import { Draggable } from "../components/Draggable.js";
import { Droppable } from "../components/Droppable.js";
import { Interactive } from "../components/Interactive.js";
import { Order } from "../components/Order.js";
import { Position } from "../components/Position.js";
import { Returnable } from "../components/Returnable.js";
import { Skewer } from "../components/Skewer.js";
import { Sprite } from "../components/Sprite.js";

const createSkewer = (world, zoneId) => {
  const skewer1 = addEntity(world);
  addComponent(world, Skewer, skewer1);
  addComponent(world, Position, skewer1);
  Position.x[skewer1] = Position.x[zoneId] - 8; //24
  Position.y[skewer1] = Position.y[zoneId] - 40; //56
  addComponent(world, Sprite, skewer1);
  Sprite.texture[skewer1] = 4;
  Sprite.frame[skewer1] = 0;
  addComponent(world, Interactive, skewer1);
  addComponent(world, Draggable, skewer1);
  addComponent(world, Droppable, skewer1);
};

export const createDropSystem = (scene, gameObjectById) => {
  const OrderQuery = defineQuery([Droppable, Order]);
  const SkewerQuery = defineQuery([Droppable, Skewer]);
  const DroppableQuery = defineQuery([Droppable]);
  const OrderQueryEnter = enterQuery(OrderQuery);
  const SkewerQueryEnter = enterQuery(SkewerQuery);
  const DroppableExitQuery = exitQuery(DroppableQuery);
  return defineSystem((world) => {
    OrderQueryEnter(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      gameObject.on("drop", (pointer, target) => {
        createSkewer(world, target.name);
        removeEntity(world, eid);
      });
    });
    SkewerQueryEnter(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      gameObject.on("drop", (pointer, target) => {
        // TODO: Check if target has component
        if (hasComponent(world, Customer, target.name)) {
          console.log(`You gave customer: ${target.name} their food!`);
          removeEntity(world, eid);
        } else {
          Position.x[eid] = target.x - 8;
          Position.y[eid] = target.y - 40;
          gameObject.removeListener("dragend");
          removeComponent(world, Returnable, eid);
        }
      });
    });
    DroppableExitQuery(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      if (gameObject) {
        gameObject.removeListener("drop");
      }
    });
  });
};
