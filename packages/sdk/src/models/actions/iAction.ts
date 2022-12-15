import { IState } from './iState';
import { TestStep } from '../tests/testStep';
import { IActionProperties } from './iActionProperties';

/**
 * Base class for the test step runners
 */
export abstract class IAction<
  Props extends IActionProperties,
  T = void,
> {
  /**
   * @param props Properties
   */
  constructor(protected readonly props: Props) {}

  /**
   * Test step entry point
   * @param state Current state
   * @param step Test step
   * @returns
   */
  public abstract run(state: IState, step: TestStep): Promise<T>;
}
