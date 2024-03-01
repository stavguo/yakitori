import { defineQuery, defineSystem, enterQuery, Not } from "bitecs";
import { PartOfContainer } from "../components/PartOfContainer.js";
import { Position } from "../components/Position.js";
import { Sprite } from "../components/Sprite.js";

const addSpriteToWorld = (eid, scene, textureMap, gameObjectById) => {
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
};

export const createSpriteSystem = (scene, gameObjectById) => {
  const spriteQuery = defineQuery([Sprite, Position, Not(PartOfContainer)]);
  const spriteQueryEnter = enterQuery(spriteQuery);
  const textureMap = scene.cache.json.get("textures");
  return defineSystem((world) => {
    spriteQueryEnter(world).forEach((eid) => {
      addSpriteToWorld(eid, scene, textureMap, gameObjectById);
    });
    spriteQuery(world).forEach((eid) => {
      const sprite = gameObjectById.get(eid);
      sprite.x = Position.x[eid];
      sprite.y = Position.y[eid];
    });
  });
};
