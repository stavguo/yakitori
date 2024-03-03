import {
  defineQuery,
  defineSystem,
  enterQuery,
  exitQuery,
  removeEntity,
} from "bitecs";
import { Container } from "../components/Container.js";
import { Position } from "../components/Position.js";
import { Size } from "../components/Size.js";

export const createContainerSystem = (scene, gameObjectById) => {
  const containerQuery = defineQuery([Container, Position, Size]);
  const containerQueryEnter = enterQuery(containerQuery);
  const containerExitQuery = exitQuery(containerQuery);
  return defineSystem((world) => {
    containerQueryEnter(world).forEach((eid) => {
      const container = scene.add.container(Position.x[eid], Position.y[eid]);
      container.setSize(Size.width[eid], Size.height[eid]);
      container.name = eid;
      gameObjectById.set(eid, container);
    });
    containerQuery(world).forEach((eid) => {
      const container = gameObjectById.get(eid);
      container.x = Position.x[eid];
      container.y = Position.y[eid];
    });
    containerExitQuery(world).forEach((eid) => {
      const container = gameObjectById.get(eid);
      container.each((gameObject) => {
        removeEntity(world, gameObject.name);
        gameObject.destroy();
      });
      container.destroy();
      gameObjectById.delete(eid);
    });
  });
};
