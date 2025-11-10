import { describe } from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";
import { getCharacterStep } from "../steps/getCharacterStep";

export function getCharacterTest(scenario: any) {
  describe("Should retrieve the correct character information", () => {
    getCharacterStep(scenario);
  });
}
