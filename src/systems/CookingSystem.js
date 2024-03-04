import { defineQuery, defineSystem, removeEntity } from "bitecs";
import { Cookable } from "../components/Cookable.js";
import { Sprite } from "../components/Sprite.js";

export const createCookingSystem = (scene, gameObjectById) => {
  const cookableQuery = defineQuery([Cookable, Sprite]);
  let now;
  return defineSystem((world) => {
    const entered = cookableQuery(world);
    for (let i = 0; i < entered.length; i++) {
      const eid = entered[i];
      const container = gameObjectById.get(eid);
      const { time } = world;
      // first iteration
      if (i === 0) {
        now = performance.now();
      }
      const delta = now - time.then;
      Cookable.currentTime[eid] -= delta;
      if (Cookable.currentTime[eid] < 0) {
        removeEntity(world, eid);
      } else {
        container.alpha = Cookable.currentTime[eid] / Cookable.totalTime[eid];
      }
      // last iteration
      if (i === entered.length - 1) {
        time.then = now;
      }
    }
    return world;
  });
};
