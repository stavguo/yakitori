import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(128, 96, "background");

    this.add.image(128, 32, "logo");

    this.add
      .text(128, 96, "Main Menu", {
        fontFamily: "Arial Black",
        fontSize: 12,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("Grill");
    });
  }
}
