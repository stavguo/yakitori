import { defineQuery, defineSystem, enterQuery, exitQuery } from "bitecs";
import { Position } from "../components/Position.js";
import { Returnable } from "../components/Returnable.js";

export const createReturnSystem = (scene, gameObjectById) => {
  const gameObjectQuery = defineQuery([Returnable]);
  const gameObjectQueryEnter = enterQuery(gameObjectQuery);
  const gameObjectQueryExit = exitQuery(gameObjectQuery);
  return defineSystem((world) => {
    gameObjectQueryEnter(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      gameObject.on("dragend", () => {
        Position.x[eid] = Math.trunc(gameObject.input.dragStartX);
        Position.y[eid] = Math.trunc(gameObject.input.dragStartY);
      });
    });
    gameObjectQueryExit(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      if (gameObject) {
        gameObject.removeListener("dragend");
      }
    });
  });
};
