// Karma configuration file for running unit tests in an Angular project with Jasmine.
// For more information on Karma configuration options, visit:
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    // Base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // Testing frameworks to use. In this case, we're using Jasmine with Angular's testing utilities
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // Plugins required for the setup. These provide integration with Jasmine, browsers, and reporting.
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'), // Generates HTML report of the test results
      require('karma-coverage-istanbul-reporter'), // Generates code coverage reports
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    // Client-side configuration to control how Karma runs the tests
    client: {
      clearContext: false // Keeps Jasmine Spec Runner output visible in the browser for debugging
    },

    // List of files/patterns to load in the browser. This is project-specific and should be populated accordingly.
    files: [
      // Example: 'src/**/*.spec.ts'
    ],

    // File preprocessor configurations. Can be used for compiling TypeScript, etc.
    preprocessors: {
      // Example: 'src/**/*.ts': ['typescript']
    },

    // MIME type mappings to ensure Karma serves files correctly. Necessary for TypeScript projects.
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },

    // Configuration for the Istanbul code coverage reporter
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), // Output directory for coverage reports
      reports: ['html', 'lcovonly'], // Report types to generate
      fixWebpackSourcePaths: true // Corrects paths in webpack-generated code
    },

    // Angular CLI configuration, if using Angular CLI's test command
    angularCli: {
      environment: 'dev' // Specifies the build environment
    },

    // Test results reporters to use. Shows progress and generates coverage reports if code coverage is enabled.
    reporters: ['progress', 'kjhtml'].concat(config.angularCli && config.angularCli.codeCoverage ? ['coverage-istanbul'] : []),

    // Web server port
    port: 9876,

    // Enable or disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging. Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers. Currently configured to start Chrome.
    browsers: ['Chrome'],

    // Continuous Integration mode. If true, Karma will start and capture all configured browsers, run tests, and then exit
    singleRun: false
  });
};
