import { fail } from 'k6';
import { Options } from 'k6/options';
import { TestData } from './helpers/types';
import { testData } from './testdata/testdata';
import { getScenarioData } from './helpers/utils';
import { getCharacterTest } from './tests/getCharacterTest';

// 1. Retrieve K6 options
const testType = __ENV.TEST_TYPE || 'smoke';
const optionsFile = `./config/options.${testType}.json`;
console.debug(`Loading k6 options from ${optionsFile}`);
export const options: Options = JSON.parse(open(optionsFile));

// 2. Retrieve test data
const env = __ENV.ENV || 'prd';
if (!env) {
  fail('No ENV found. Set ENV=dev or ENV=prd');
}

const allData: TestData = testData[env as keyof typeof testData];

// 3. Execute test scenarios
export function getCharacterTestScenario() {
  const scenario = getScenarioData(
    allData,
    'getCharacterTestData'
  );
  getCharacterTest(scenario);
}
