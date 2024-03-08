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

export const createSkewerMovementSystem = (scene, gameObjectById) => {
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
      });
      gameObject.on("drag", (_, dragX, dragY) => {
        Position.x[eid] = Math.trunc(dragX);
        Position.y[eid] = Math.trunc(dragY);
      });
      gameObject.on("drop", (_, target) => {
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
          if (!hasComponent(world, Occupied, target.name)) {
            Position.x[eid] = target.x;
            Position.y[eid] = target.y;
            addComponent(world, Cooking, eid);
            addComponent(world, Occupied, target.name);
            removeComponent(world, Occupied, Skewer.grillSlot[eid]);
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
