import { TestStep } from './testStep';

export class Shortcut {
  type: string;

  name: string;

  values?: string[];

  steps: TestStep[];
}
