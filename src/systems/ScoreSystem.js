import { defineQuery, defineSystem, enterQuery, removeComponent } from "bitecs";
import { Score } from "../components/Score.js";
import { UpdateScore } from "../components/UpdateScore.js";

export const createScoreSystem = (gameObjectById) => {
  const scoreQuery = defineQuery([Score]);
  const updateScoreQuery = defineQuery([UpdateScore]);
  const scoreQueryEnter = enterQuery(scoreQuery);
  const updateScoreEnterQuery = enterQuery(updateScoreQuery);
  let scoreText;
  let scoreVal = 0;
  return defineSystem((world) => {
    scoreQueryEnter(world).forEach((eid) => {
      scoreText = gameObjectById.get(eid);
      scoreText.text = `$${scoreVal}`;
    });
    updateScoreEnterQuery(world).forEach((eid) => {
      scoreVal += UpdateScore.value[eid];
      scoreText.text = `$${scoreVal}`;
      removeComponent(world, UpdateScore, eid);
    });
  });
};
