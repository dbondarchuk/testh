import { readFileSync } from 'fs';
import * as YAML from 'yaml';
import { Test } from './models/tests/test';
import { TestRunner } from './runners/testRunner';

async function main(pathToTest: string): Promise<number> {
    let test: Test = null;
    if (pathToTest?.endsWith('.json')) {
        test = JSON.parse(readFileSync(pathToTest).toString()) as Test;
    } else if (pathToTest?.endsWith('.yaml') || pathToTest?.endsWith('.yml')) {
        test = YAML.parse(readFileSync(pathToTest).toString()) as Test;
    } else {
        console.error('Unknown file type');

        return 1;
    }

    const runner = new TestRunner(test);
    const result = await runner.run();

    return result ? 0 : 2;
}

main(process.argv[2]);
