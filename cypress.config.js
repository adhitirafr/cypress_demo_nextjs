const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement any custom event listeners here
    },
    // Configuration options for screenshots
    screenshotsFolder: "cypress/screenshots", // Default is "cypress/screenshots"
    screenshotOnRunFailure: true, // Take a screenshot on test failure

    // Configuration options for videos
    videosFolder: "cypress/videos", // Default is "cypress/videos"
    video: true, // Enable video recording
    videoUploadOnPasses: false, // Only upload videos for failed tests (set to true to upload all videos)
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    // Configuration options for component testing
    screenshotsFolder: "cypress/screenshots", // Default is "cypress/screenshots"
    screenshotOnRunFailure: true, // Take a screenshot on test failure
    videosFolder: "cypress/videos", // Default is "cypress/videos"
    video: true, // Enable video recording
    videoUploadOnPasses: false, // Only upload videos for failed tests
  },
});
