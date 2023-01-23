/**
 * Describes either a delayed condition or already executed one
 */
//export type Condition = () => Promise<boolean> | boolean;

import { IState } from '../tests';

/**
 * Describes a predicate which gets a condition result
 */
export type Condition = (state: IState) => Promise<boolean>;
