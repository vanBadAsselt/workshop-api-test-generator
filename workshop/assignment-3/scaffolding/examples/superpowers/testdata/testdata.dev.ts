import { TestData } from "../helpers/types";

export const dev: TestData = {
  baseUrl: "http://localhost:4000/",
  scenarios: [
    {
      name: "getCharacterTestData",
      description: "Get Character Test Data",
      characterId: "1002",
    },
  ],
};
