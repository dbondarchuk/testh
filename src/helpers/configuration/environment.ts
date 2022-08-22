import * as fs from 'fs';

/**
 * Checks if is executed inside a Docker container
 * @returns If the test is executed inside a Docker container
 */
export const isDockerEnvironment = (): boolean => {
    const procFile = '/proc/self/cgroup';

    return (
        fs.existsSync('./dockerenv') ||
        (fs.existsSync(procFile) &&
            fs.lstatSync(procFile).isFile() &&
            fs
                .readFileSync(procFile)
                .toString()
                .toLowerCase()
                .indexOf('docker') >= 0)
    );
};

/**
 * Checks if is executed in headless environment (no graphic interface)
 * @returns If the test is executed in headless environment
 */
export const isHeadlessEnvironment = (): boolean => {
    return isDockerEnvironment();
};
