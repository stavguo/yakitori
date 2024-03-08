import { defineQuery, defineSystem, enterQuery, removeComponent } from "bitecs";
import { Cooking } from "../components/Cooking.js";
import { Skewer } from "../components/Skewer.js";

export const createCookingSystem = (scene, menuMap, gameObjectById) => {
  const skewerQuery = defineQuery([Cooking, Skewer]);
  const skewerQueryEnter = enterQuery(skewerQuery);
  return defineSystem((world) => {
    skewerQueryEnter(world).forEach((eid) => {
      const container = gameObjectById.get(eid);
      const raw = container.list.at(-1);
      if (!Object.hasOwn(raw, "cookingDuration")) {
        const { time } = world;
        console.log(`started cooking at ${time.then}`);
        raw.cookingDuration = 0;
      }
    });
    skewerQuery(world).forEach((eid) => {
      const container = gameObjectById.get(eid);
      const raw = container.list.at(-1);
      const { time } = world;
      raw.cookingDuration += time.delta;
      const durationToFade = menuMap[Skewer.type[eid]][3];
      const alpha = Math.max(0, 1 - raw.cookingDuration / durationToFade);
      raw.setAlpha(alpha);
      if (raw.alpha === 0) {
        removeComponent(world, Cooking, eid);
        console.log(`finished cooking at ${time.then}`);
      }
    });
  });
};
