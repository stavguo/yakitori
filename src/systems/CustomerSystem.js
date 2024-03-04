import {
  addComponent,
  addEntity,
  defineQuery,
  defineSystem,
  enterQuery,
} from "bitecs";
import { Container } from "../components/Container.js";
import { Customer } from "../components/Customer.js";
import { Draggable } from "../components/Draggable.js";
import { Droppable } from "../components/Droppable.js";
import { Interactive } from "../components/Interactive.js";
import { MenuText } from "../components/MenuText.js";
import { Order } from "../components/Order.js";
import { PartOfContainer } from "../components/PartOfContainer.js";
import { Position } from "../components/Position.js";
import { Returnable } from "../components/Returnable.js";
import { Size } from "../components/Size.js";
import { Sprite } from "../components/Sprite.js";
import { Zone } from "../components/Zone.js";

const makeOrder = (world, xPos, yPos) => {
  const order1 = addEntity(world);
  addComponent(world, Order, order1);
  addComponent(world, Container, order1);
  addComponent(world, Position, order1);
  Position.x[order1] = xPos + 16;
  Position.y[order1] = yPos + 6;
  addComponent(world, Size, order1);
  Size.width[order1] = 32;
  Size.height[order1] = 12;
  addComponent(world, Interactive, order1);
  addComponent(world, Draggable, order1);
  addComponent(world, Droppable, order1);
  addComponent(world, Returnable, order1);

  const speechBubble1 = addEntity(world);
  addComponent(world, Position, speechBubble1);
  Position.x[speechBubble1] = -16;
  Position.y[speechBubble1] = -6;
  addComponent(world, Sprite, speechBubble1);
  Sprite.texture[speechBubble1] = 2;
  Sprite.frame[speechBubble1] = 0;
  addComponent(world, PartOfContainer, speechBubble1);
  PartOfContainer.eid[speechBubble1] = order1;

  const orderText1 = addEntity(world);
  addComponent(world, Position, orderText1);
  Position.x[orderText1] = 3 - 16;
  Position.y[orderText1] = -4 - 6;
  addComponent(world, MenuText, orderText1);
  MenuText.item[orderText1] = 0;
  MenuText.field[orderText1] = 0;
  addComponent(world, PartOfContainer, orderText1);
  PartOfContainer.eid[orderText1] = order1;
};

export const createCustomerSystem = (scene, gameObjectById) => {
  const customerQuery = defineQuery([Customer]);
  const customerQueryEnter = enterQuery(customerQuery);
  return defineSystem((world) => {
    customerQueryEnter(world).forEach((eid) => {
      const customer1 = addEntity(world);
      addComponent(world, Container, customer1);
      addComponent(world, Position, customer1);
      Position.x[customer1] = 24;
      Position.y[customer1] = 24;
      addComponent(world, Size, customer1);
      Size.width[customer1] = 32;
      Size.height[customer1] = 32;

      const customerSprite1 = addEntity(world);
      addComponent(world, Position, customerSprite1);
      Position.x[customerSprite1] = 0;
      Position.y[customerSprite1] = 0;
      addComponent(world, Sprite, customerSprite1);
      Sprite.texture[customerSprite1] = 1;
      Sprite.frame[customerSprite1] = 0;
      addComponent(world, PartOfContainer, customerSprite1);
      PartOfContainer.eid[customerSprite1] = customer1;

      addComponent(world, Zone, eid);
      addComponent(world, Position, eid);
      Position.x[eid] = 16;
      Position.y[eid] = 16;
      addComponent(world, Size, eid);
      Size.width[eid] = 32;
      Size.height[eid] = 32;
      addComponent(world, PartOfContainer, eid);
      PartOfContainer.eid[eid] = customer1;

      makeOrder(world, 24, 16);
      makeOrder(world, 24, 16);
      makeOrder(world, 24, 16);
    });
  });
};
