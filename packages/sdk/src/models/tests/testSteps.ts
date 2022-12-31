import { Variables } from '../variables/variables';
import { TestStep } from './testStep';

/**
 * Describes a list of tests steps with additional variables for those steps
 */
export class TestSteps extends Array<TestStep> {
  /**
   * Additional base variables for the steps
   */
  variables: Variables;
}

/**
 * Creates new TestSteps from list steps and additional variables
 * @param steps List of steps
 * @param variables Additional variables
 * @returns {TestSteps} Wrapper around test steps and variables
 */
export function stepsWrapper(
  steps: TestStep[],
  variables?: Variables,
): TestSteps {
  const wrapper = new TestSteps(...steps);

  if (variables) wrapper.variables = variables;

  return wrapper;
}
