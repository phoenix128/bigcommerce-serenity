module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {},
    setupFilesAfterEnv: ['./jest.setup.js'],
};
