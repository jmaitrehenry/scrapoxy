import * as dotenv from 'dotenv';


if (process.env.DOTENV_FILE) {
    dotenv.config({
        path: process.env.DOTENV_FILE,
    });
}

console.log(process.env);

export default {
    displayName: 'backend-test',
    preset: '../../../jest.preset.js',
    testTimeout: 10000,
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
                isolatedModules: true,
                useESM: true,
                verbatimModuleSyntax: false,
            },
        ],
    },
    testEnvironment: 'node',
};
