import { defineQuery, defineSystem, enterQuery } from "bitecs";
import { Position } from "../components/Position.js";
import { Size } from "../components/Size.js";
import { Zone } from "../components/Zone.js";

export const createZoneSystem = (scene, gameObjectById) => {
  const containerQuery = defineQuery([Zone, Position, Size]);
  const containerQueryEnter = enterQuery(containerQuery);
  return defineSystem((world) => {
    containerQueryEnter(world).forEach((eid) => {
      const zone = scene.add
        .zone(
          Position.x[eid],
          Position.y[eid],
          Size.width[eid],
          Size.height[eid],
        )
        .setRectangleDropZone(Size.width[eid], Size.height[eid]);
      zone.name = eid;
      gameObjectById.set(eid, zone);
      if (scene.physics.world.drawDebug) {
        scene.input.enableDebug(zone);
      }
    });
  });
};
