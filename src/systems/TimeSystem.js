import { defineSystem } from "bitecs";

export const createTimeSystem = () => {
  return defineSystem((world) => {
    const { time } = world;
    const now = performance.now();
    const delta = now - time.then;
    time.delta = delta;
    time.then = now;
    return world;
  });
};
