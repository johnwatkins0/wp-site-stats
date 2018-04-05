module.exports = {
    testMatch: [ '**/?(*.)(spec|test).js?(x)' ],
    collectCoverage: true,
    collectCoverageFrom: [ 'src/js/**/*.js' ],
    coveragePathIgnorePatterns: [ '/node_modules/', 'index.js' ],
    globals: {
        wp: {}
    }
};
