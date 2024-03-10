import { defineComponent, Types } from "bitecs";

export const Skewer = defineComponent({
  type: Types.ui8,
  completion: Types.f32,
  grillSlot: Types.eid,
});
