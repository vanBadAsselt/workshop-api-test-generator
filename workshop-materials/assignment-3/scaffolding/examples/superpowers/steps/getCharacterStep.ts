import { graphQl } from "../helpers/graphql";
import { expectValidJson } from "../helpers/utils";
import { expect } from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";
import { getCharacterQuery } from "../queries/getCharacterQuery";

export function getCharacterStep(scenario: any) {
  const variables = { id: scenario.characterId };
  const response = graphQl.query(getCharacterQuery, variables);
  const responseJson = expectValidJson(response);
  console.log(responseJson);

  try {
    const { getCharacter } = responseJson.data;
    expect(getCharacter.__typename, "Typename").to.equal("Character");
    expect(getCharacter.id, "Character ID").to.be.a("string");
    expect(getCharacter.name, "Character Name").to.be.a("string");
    expect(getCharacter.slug, "Character Slug").to.be.a("string");
    expect(getCharacter.totalPower, "Total Power").to.be.a("number");

    const image = getCharacter.image;
    expect(image.__typename, "Image Typename").to.equal("Image");
    expect(image.url, "Image URL").to.be.a("string");

    const powerstats = getCharacter.powerstats;
    expect(powerstats.__typename, "Powerstats Typename").to.equal("Powerstats");
    expect(powerstats.intelligence, "Intelligence").to.be.a("string");
    expect(powerstats.strength, "Strength").to.be.a("string");
    expect(powerstats.speed, "Speed").to.be.a("string");
    expect(powerstats.durability, "Durability").to.be.a("string");
    expect(powerstats.power, "Power").to.be.a("string");
    expect(powerstats.combat, "Combat").to.be.a("string");

    const biography = getCharacter.biography;
    expect(biography.__typename, "Biography Typename").to.equal("Biography");
    expect(biography.fullName, "Full Name").to.be.a("string");
    expect(biography.aliases, "Aliases").to.be.an("array");
    if (biography.aliases.length > 0) {
      expect(biography.aliases[0], "First Alias").to.be.a("string");
    }
    expect(biography.placeOfBirth, "Place of Birth").to.be.a("string");
    expect(biography.alignment, "Alignment").to.be.a("string");
    expect(biography.publisher, "Publisher").to.be.a("string");
    expect(biography.firstAppearance, "First Appearance").to.be.a("string");

    const appearance = getCharacter.appearance;
    expect(appearance.__typename, "Appearance Typename").to.equal("Appearance");
    expect(appearance.gender, "Gender").to.be.a("string");
    expect(appearance.race, "Race").to.be.a("string");
    expect(appearance.height, "Height").to.be.an("array");
    if (appearance.height.length > 0) {
      expect(appearance.height[0], "First Height").to.be.a("string");
    }
    expect(appearance.weight, "Weight").to.be.an("array");
    if (appearance.weight.length > 0) {
      expect(appearance.weight[0], "First Weight").to.be.a("string");
    }

    const work = getCharacter.work;
    expect(work.__typename, "Work Typename").to.equal("Work");
    expect(work.occupation, "Occupation").to.be.a("string");
    expect(work.base, "Base").to.be.a("string");
  } catch (error) {
    console.error("Error in getCharacterStep:", error);
    console.error("Response JSON:", responseJson);
    throw error;
  }
}
