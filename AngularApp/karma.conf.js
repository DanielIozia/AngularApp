module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // lascia il contesto Jasmine visibile nel browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/your-app-name'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Brave'],
    customLaunchers: {
      Brave: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
        executablePath: process.env.CHROME_BIN // utilizza la variabile d'ambiente CHROME_BIN
      }
    },
    singleRun: false,
    restartOnFileChange: true
  });
};
