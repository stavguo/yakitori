import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");
    ``;
    this.load.image("grill", "grill.png");
    this.load.image("skewer", "skewer.png");
    this.load.image("momo_raw", "momo_raw.png");
    this.load.image("momo_cooked", "momo_cooked.png");
    this.load.image("speech_bubble", "speech_bubble.png");
    this.load.image("crosshair", "crosshair.png");
    this.load.spritesheet("customer1", "customer_1_sheet.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.bitmapFont(
      "eighties",
      "eighties-v1/eighties_0.png",
      "eighties-v1/eighties.fnt",
    );
    // load data
    this.load.setPath("src/data");
    this.load.json("menu", "menu.json");
    this.load.json("textures", "textures.json");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("MainMenu");
  }
}
