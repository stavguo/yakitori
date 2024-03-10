import { defineQuery, defineSystem, enterQuery, removeComponent } from "bitecs";
import { Cooking } from "../components/Cooking.js";
import { Skewer } from "../components/Skewer.js";

export const createCookingSystem = (scene, menuMap, gameObjectById) => {
  const skewerQuery = defineQuery([Cooking, Skewer]);
  const skewerQueryEnter = enterQuery(skewerQuery);
  return defineSystem((world) => {
    skewerQueryEnter(world).forEach((eid) => {
      const container = gameObjectById.get(eid);
      if (!Object.hasOwn(container, "cookingDuration")) {
        container.cookingDuration = 0;
      }
    });
    skewerQuery(world).forEach((eid) => {
      const container = gameObjectById.get(eid);
      const raw = container.list.at(-1);
      const cooked = container.list.at(-2);
      const { time } = world;
      container.cookingDuration += time.delta;
      const durationToCook = menuMap[Skewer.type[eid]][3];
      const durationToBurn = menuMap[Skewer.type[eid]][4];
      if (raw.visible) {
        const alpha = Math.max(
          0,
          1 - container.cookingDuration / durationToCook,
        );
        raw.setAlpha(alpha);
        Skewer.completion[eid] = alpha > 0.05 ? 1 - alpha : 1;
        if (raw.alpha === 0) {
          container.cookingDuration = 0;
          raw.setVisible(false);
        }
      } else {
        const alpha = Math.max(
          0,
          1 - container.cookingDuration / durationToBurn,
        );
        cooked.setAlpha(alpha);
        Skewer.completion[eid] = alpha > 0.95 ? 1 : alpha;
        if (cooked.alpha === 0) {
          cooked.setVisible(false);
          removeComponent(world, Cooking, eid);
        }
      }
    });
  });
};
