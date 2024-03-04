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
import { Container } from "../components/Container.js";
import { Size } from "../components/Size.js";
import { PartOfContainer } from "../components/PartOfContainer.js";
import { Cookable } from "../components/Cookable.js";
import { Value } from "../components/Value.js";
import { Score } from "../components/Score.js";
import { UpdateScore } from "../components/UpdateScore.js";

const createSkewer = (world, zoneId) => {
  const skewer1 = addEntity(world);
  addComponent(world, Container, skewer1);
  addComponent(world, Skewer, skewer1);
  addComponent(world, Position, skewer1);
  Position.x[skewer1] = Position.x[zoneId]; //24
  Position.y[skewer1] = Position.y[zoneId]; //56
  addComponent(world, Size, skewer1);
  Size.width[skewer1] = 16;
  Size.height[skewer1] = 80;
  addComponent(world, Value, skewer1);
  Value.amount[skewer1] = 100;
  addComponent(world, Interactive, skewer1);
  addComponent(world, Draggable, skewer1);
  addComponent(world, Droppable, skewer1);

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
  addComponent(world, Cookable, raw);
  Cookable.totalTime[raw] = 10000;
  Cookable.currentTime[raw] = 10000;
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
        if (!hasComponent(world, Customer, target.name)) {
          createSkewer(world, target.name);
          removeEntity(world, eid);
        }
      });
    });
    SkewerQueryEnter(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      gameObject.on("drop", (pointer, target) => {
        if (hasComponent(world, Customer, target.name)) {
          // Update Score
          addComponent(world, UpdateScore, target.name);
          UpdateScore.value[target.name] = 100;
          console.log(`
            You gave customer #${target.name} their food!
            End of demo.
            `);
          removeEntity(world, eid);
        } else {
          Position.x[eid] = target.x;
          Position.y[eid] = target.y;
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
