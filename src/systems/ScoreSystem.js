import { defineQuery, defineSystem, enterQuery, removeComponent } from "bitecs";
import { Position } from "../components/Position.js";
import { Score } from "../components/Score.js";
import { UpdateScore } from "../components/UpdateScore.js";

export const createScoreSystem = (scene, gameObjectById) => {
  const scoreQuery = defineQuery([Score]);
  const updateScoreQuery = defineQuery([UpdateScore]);
  const scoreQueryEnter = enterQuery(scoreQuery);
  const updateScoreEnterQuery = enterQuery(updateScoreQuery);
  let scoreText;
  let scoreVal = 0;
  return defineSystem((world) => {
    scoreQueryEnter(world).forEach((eid) => {
      scoreText = scene.add.bitmapText(
        Position.x[eid],
        Position.y[eid],
        "eighties",
        `$${scoreVal}`,
        12,
      );
      scoreText.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
      scoreText.name = eid;
      gameObjectById.set(eid, scoreText);
    });
    updateScoreEnterQuery(world).forEach((eid) => {
      scoreVal += UpdateScore.value[eid];
      scoreText.text = `$${scoreVal}`;
      removeComponent(world, UpdateScore, eid);
    });
  });
};
