import { defineComponent, Types } from "bitecs";

export const Cookable = defineComponent({
  totalTime: Types.f32,
  currentTime: Types.f32,
});
