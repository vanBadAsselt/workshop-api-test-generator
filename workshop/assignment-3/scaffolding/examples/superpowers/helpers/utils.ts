// Utility functions for superpowers API tests
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { RefinedResponse, ResponseType } from 'k6/http';
import { TestData, TestScenario } from './types';

export function getScenarioData(
  testData: TestData,
  scenarioName: string
): TestScenario | undefined {
  return testData.scenarios.find(
    (scenario) => scenario.name === scenarioName
  );
}

export function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Validates that the response has the expected status and valid JSON body
 * @param response The HTTP response to validate
 * @param expectedStatus The expected HTTP status code (default: 200)
 * @returns The parsed JSON response
 * @throws Error if validation fails
 */
export function expectValidJson(
  response: RefinedResponse<ResponseType>,
  expectedStatus = 200
): any {
  try {
    expect(response.status, 'response status').to.equal(expectedStatus);

    if (!response.body) {
      console.error('❌ Test failed: response body is empty');
      console.error(`Status code: ${response.status}`);
    }

    expect(response, 'valid JSON').to.have.validJsonBody();
    return response.json() as any;
  } catch (error) {
    console.error('❌ Test failed, no valid JSON: ');
    console.error(`Status code: ${response.status}`);
    console.error('Response body:', response.body || 'No body present');
    console.error('Error details:', error);
    throw error;
  }
}
