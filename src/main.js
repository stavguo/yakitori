import * as Phaser from "phaser";

import { Boot } from "./scenes/Boot.js";
import { GameOver } from "./scenes/GameOver.js";
import { Grill } from "./scenes/Grill.js";
import { Main } from "./scenes/Main.js";
import { MainMenu } from "./scenes/MainMenu.js";
import { Preloader } from "./scenes/Preloader.js";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 192,
  parent: "game-container",
  backgroundColor: "#028af8",
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [Boot, Preloader, MainMenu, Main, Grill, GameOver],
};

export default new Phaser.Game(config);
