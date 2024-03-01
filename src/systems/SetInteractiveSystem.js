import { defineQuery, defineSystem, enterQuery } from "bitecs";
import { Interactive } from "../components/Interactive.js";

export const createSetInteractiveSystem = (scene, gameObjectById) => {
  const gameObjectQuery = defineQuery([Interactive]);
  const gameObjectQueryEnter = enterQuery(gameObjectQuery);
  return defineSystem((world) => {
    gameObjectQueryEnter(world).forEach((eid) => {
      const gameObject = gameObjectById.get(eid);
      gameObject.setInteractive();
    });
  });
};
