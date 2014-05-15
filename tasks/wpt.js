/*
 * grunt-wpt
 * https://github.com/tim/grunt-wpt
 *
 * Copyright (c) 2014 Tim Kadlec
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('wpt', 'Grunt task for WebPageTest', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      url: "http://timkadlec.com",
      key: "***REMOVED***",
      location: "Dulles_Nexus5",
      thresholds: {
        visualComplete: '1000'
      }
    });
    var testId,
        curStatus,
        myTimer;

    var processData = function(data) {
      if (data.data.median.firstView.visualComplete > options.thresholds.visualComplete) {
        grunt.log.error('\n\n-----------------------------------------------' +
              '\nTest for ' + options.url + ' \t  FAILED' +
            '\n-----------------------------------------------\n\n');
        grunt.log.error('Render time: ' + data.data.median.firstView.visualComplete + ', threshold is ' + options.thresholds.visualComplete);
      } else {
        grunt.log.ok('\n\n-----------------------------------------------' +
              '\nTest for ' + options.url + ' \t  PASSED' +
            '\n-----------------------------------------------\n\n');
        grunt.log.ok('Render time: ' + data.data.median.firstView.visualComplete + ', threshold is ' + options.thresholds.visualComplete);
      }
    };

    var retrieveResults = function() {
      var response;
      wpt.getTestResults(testId, function(err, data) {
        response = data.response;
        if (response.statusCode === 200) {
          clearTimeout(myTimer);
          processData(response); 
        } else {
          if (response.statusCode !== curStatus) {
            grunt.log.writeln( (response.statusText + '...').cyan );
            curStatus = response.statusCode;
          }
          myTimer = setTimeout(function(testId) {
            retrieveResults(testId);
          }, 1000);
        }
      });
    };
    var done = this.async(),
        WebPageTest = require('webpagetest'),
        spawn = require('child_process').spawn,
        wpt = new WebPageTest('www.webpagetest.org', options.key),
        err, data;

        grunt.log.writeln( ('Running test...').cyan );
        wpt.runTest(options.url, {location: options.location, video: 1}, function(err, data) {
          if (data.statusCode === 200) {
            testId = data.data.testId;
            grunt.log.writeln( ('Test ID ' + testId + ' obtained....').cyan );
            
            retrieveResults(testId);
          }
        });
  });

};
