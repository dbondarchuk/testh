/**
 * Base type for test step runner properties
 */

import { Transform } from 'class-transformer';
import { TestSteps } from '../tests/testSteps';

export type IActionProperties = Record<string, any>;

/**
 * Describes a class for step runner properties which runs additional test steps
 */
export class ActionWithStepsProperties implements IActionProperties {
  /**
   * Steps to run
   */
  @Transform((params) => {
    return params.obj[params.key];
  })
  steps: TestSteps;
}
