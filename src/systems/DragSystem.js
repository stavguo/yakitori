import {
  addComponent,
  defineQuery,
  defineSystem,
  enterQuery,
  exitQuery,
} from "bitecs";
import { Draggable } from "../components/Draggable.js";
import { Position } from "../components/Position.js";
import { Returnable } from "../components/Returnable.js";

export const createDragSystem = (scene, gameObjectById) => {
  const gameObjectQuery = defineQuery([Draggable, Position]);
  const gameObjectQueryEnter = enterQuery(gameObjectQuery);
  const gameObjectQueryExit = exitQuery(gameObjectQuery);
  return defineSystem((world) => {
    gameObjectQueryEnter(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      scene.input.setDraggable(gameObject);
      //scene.input.enableDebug(gameObject);
      gameObject.on("dragstart", () => {
        addComponent(world, Returnable, eid);
      });
      gameObject.on("drag", (_, dragX, dragY) => {
        Position.x[eid] = Math.trunc(dragX);
        Position.y[eid] = Math.trunc(dragY);
      });
    });
    gameObjectQueryExit(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      if (gameObject) {
        gameObject.removeListener("dragstart");
        gameObject.removeListener("drag");
      }
    });
  });
};
