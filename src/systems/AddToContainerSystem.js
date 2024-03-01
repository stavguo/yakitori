import { defineQuery, defineSystem, enterQuery } from "bitecs";
import { MenuText } from "../components/MenuText.js";
import { PartOfContainer } from "../components/PartOfContainer.js";
import { Position } from "../components/Position.js";
import { Sprite } from "../components/Sprite.js";

const addSpriteToContainer = (eid, scene, textureMap, gameObjectById) => {
  const container = gameObjectById.get(PartOfContainer.eid[eid]);
  const sprite = scene.add
    .sprite(
      Position.x[eid],
      Position.y[eid],
      textureMap[Sprite.texture[eid]],
      Sprite.frame[eid],
    )
    .setOrigin(0);
  sprite.name = eid;
  gameObjectById.set(eid, sprite);
  container.add(sprite);
};

const addTextToContainer = (eid, scene, menuMap, gameObjectById) => {
  const container = gameObjectById.get(PartOfContainer.eid[eid]);
  const text = scene.add.bitmapText(
    Position.x[eid],
    Position.y[eid],
    "eighties",
    menuMap[MenuText.item[eid]][MenuText.field[eid]],
    12,
  );
  text.name = eid;
  gameObjectById.set(eid, text);
  container.add(text);
};

export const createAddToContainerSystem = (scene, gameObjectById) => {
  const spriteQuery = defineQuery([PartOfContainer, Sprite, Position]);
  const textQuery = defineQuery([PartOfContainer, MenuText, Position]);
  const spriteQueryEnter = enterQuery(spriteQuery);
  const textQueryEnter = enterQuery(textQuery);
  const textureMap = scene.cache.json.get("textures");
  const menuMap = scene.cache.json.get("menu");
  return defineSystem((world) => {
    spriteQueryEnter(world).forEach((eid) => {
      addSpriteToContainer(eid, scene, textureMap, gameObjectById);
    });
    textQueryEnter(world).forEach((eid) => {
      addTextToContainer(eid, scene, menuMap, gameObjectById);
    });
  });
};
