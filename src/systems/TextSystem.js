import { defineQuery, defineSystem, enterQuery, hasComponent } from "bitecs";
import { MenuText } from "../components/MenuText.js";
import { PartOfContainer } from "../components/PartOfContainer.js";
import { Position } from "../components/Position.js";

export const createTextSystem = (scene, gameObjectById) => {
  const textQuery = defineQuery([MenuText, Position]);
  const textQueryEnter = enterQuery(textQuery);
  const menuMap = scene.cache.json.get("menu");
  return defineSystem((world) => {
    textQueryEnter(world).forEach((eid) => {
      const text = scene.add.bitmapText(
        Position.x[eid],
        Position.y[eid],
        "eighties",
        menuMap[MenuText.item[eid]][MenuText.field[eid]],
        12,
      );
      text.setTint(0x000000, 0x000000, 0x000000, 0x000000);
      text.name = eid;
      gameObjectById.set(eid, text);
      if (hasComponent(world, PartOfContainer, eid)) {
        const container = gameObjectById.get(PartOfContainer.eid[eid]);
        container.add(text);
      }
    });
  });
};
