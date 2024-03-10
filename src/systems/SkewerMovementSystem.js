import {
  addComponent,
  defineQuery,
  defineSystem,
  enterQuery,
  entityExists,
  hasComponent,
  removeComponent,
  removeEntity,
} from "bitecs";
import { Cooking } from "../components/Cooking.js";
import { Customer } from "../components/Customer.js";
import { DragAndDrop } from "../components/DragAndDrop.js";
import { Occupied } from "../components/Occupied.js";
import { Position } from "../components/Position.js";
import { Skewer } from "../components/Skewer.js";
import { UpdateScore } from "../components/UpdateScore.js";

export const createSkewerMovementSystem = (scene, menuMap, gameObjectById) => {
  const SkewerQuery = defineQuery([DragAndDrop, Skewer]);
  const SkewerQueryEnter = enterQuery(SkewerQuery);
  return defineSystem((world) => {
    SkewerQueryEnter(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      gameObject.setInteractive();
      scene.input.setDraggable(gameObject);
      if (scene.physics.world.drawDebug) {
        scene.input.enableDebug(gameObject);
      }
      gameObject.on("dragstart", () => {
        scene.children.bringToTop(gameObject);
        removeComponent(world, Cooking, eid);
        console.log(Skewer.completion[eid]);
      });
      gameObject.on("drag", (_, dragX, dragY) => {
        Position.x[eid] = Math.trunc(dragX);
        Position.y[eid] = Math.trunc(dragY);
      });
      gameObject.on("drop", (_, target) => {
        if (hasComponent(world, Customer, target.name)) {
          addComponent(world, UpdateScore, target.name);
          removeComponent(world, Occupied, Skewer.grillSlot[eid]);
          UpdateScore.value[target.name] =
            Math.round(
              (Skewer.completion[eid] * menuMap[Skewer.type[eid]][5]) / 10,
            ) * 10;
          removeEntity(world, eid);
        } else {
          if (!hasComponent(world, Occupied, target.name)) {
            if (target.name != Skewer.grillSlot[eid]) {
              removeComponent(world, Occupied, Skewer.grillSlot[eid]);
            }
            Position.x[eid] = target.x;
            Position.y[eid] = target.y;
            addComponent(world, Cooking, eid);
            addComponent(world, Occupied, target.name);
            // updating this skewer's spot comes last, need pointer to prev
            Skewer.grillSlot[eid] = target.name;
          }
        }
      });
      gameObject.on("dragend", () => {
        if (entityExists(world, eid)) {
          if (!hasComponent(world, Cooking, eid)) {
            Position.x[eid] = Math.trunc(gameObject.input.dragStartX);
            Position.y[eid] = Math.trunc(gameObject.input.dragStartY);
            addComponent(world, Cooking, eid);
          }
        }
      });
    });
  });
};
