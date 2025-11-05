// Type definitions for superpowers API tests

export interface TestScenario {
  name: string;
  description?: string;
  [key: string]: any;
}

export interface TestData {
  baseUrl?: string;
  scenarios: TestScenario[];
}
