import {
  defineQuery,
  defineSystem,
  enterQuery,
  exitQuery,
  hasComponent,
} from "bitecs";
import { PartOfContainer } from "../components/PartOfContainer.js";
import { Position } from "../components/Position.js";
import { Sprite } from "../components/Sprite.js";

export const createSpriteSystem = (scene, gameObjectById) => {
  const spriteQuery = defineQuery([Sprite, Position]);
  const spriteQueryEnter = enterQuery(spriteQuery);
  const spriteQueryExit = exitQuery(spriteQuery);
  const textureMap = scene.cache.json.get("textures");
  return defineSystem((world) => {
    spriteQueryEnter(world).forEach((eid) => {
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
      if (hasComponent(world, PartOfContainer, eid)) {
        const container = gameObjectById.get(PartOfContainer.eid[eid]);
        container.add(sprite);
      }
    });
    spriteQuery(world).forEach((eid) => {
      const sprite = gameObjectById.get(eid);
      sprite.x = Position.x[eid];
      sprite.y = Position.y[eid];
    });
    spriteQueryExit(world).forEach((eid) => {
      const sprite = gameObjectById.get(eid);
      sprite.destroy();
      gameObjectById.delete(eid);
    });
  });
};
