/*
 * grunt-perfbudget
 * https://github.com/tkadlec/grunt-perfbudget
 *
 * Copyright (c) 2014 Tim Kadlec
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('perfbudget', 'Grunt task for Performance Budgeting', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      url: '',
      key: '',
      location: "Dulles:Chrome",
      wptInstance: "https://www.webpagetest.org",
      connectivity: '',
      bandwidthDown: '',
      bandwidthUp: '',
      latency: '',
      packetLossRate: '',
      login: '',
      password: '',
      authenticationType: '',
      video: 1,
      runs: 1,
      pollResults: 5,
      timeout: 60,
      repeatView: false,
      budget: {
        visualComplete: '',
        render: '1000',
        loadTime: '',
        docTime: '',
        fullyLoaded: '',
        bytesIn: '',
        bytesInDoc: '',
        requests: '',
        requestsDoc: '',
        SpeedIndex: '1000'
      }
    });

    var testId,
        curStatus;

    var logErrorAndExit = function(msg) {
      grunt.log.error((msg).red);
      done(false);
    };

    // takes the data returned by wpt.getTestResults and compares
    // to our budget thresholds
    var processData = function(data) {

      var budget = options.budget,
          summary = data.data.summary,
          median = options.repeatView ? data.data.median.repeatView : data.data.median.firstView,
          pass = true,
          str = "";

      for (var item in budget) {
        // make sure this is objects own property and not inherited
        if (budget.hasOwnProperty(item)) {
          //make sure it exists
          if (budget[item] !== '' && median.hasOwnProperty(item)) {
            if (median[item] > budget[item]) {
              pass = false;
              str += item + ': ' + median[item] + ' [FAIL]. Budget is ' + budget[item] + '\n';
            } else {
              str += item + ': ' + median[item] + ' [PASS]. Budget is ' + budget[item] + '\n';
            }
          }
        }
      }

      //save the file before failing or passing
      var output = options.output;
      if (typeof output !== 'undefined') {
        grunt.log.ok('Writing file: ' + output);
        grunt.file.write(output, JSON.stringify(data));
      }

      //
      //output our header and results
      if (!pass) {
        grunt.log.error('\n\n-----------------------------------------------' +
              '\nTest for ' + options.url + ' \t  FAILED' +
            '\n-----------------------------------------------\n\n');
        grunt.log.error(str);
        grunt.log.error('Summary: ' + summary);
        done(false);
      } else {
        grunt.log.ok('\n\n-----------------------------------------------' +
              '\nTest for ' + options.url + ' \t  PASSED' +
            '\n-----------------------------------------------\n\n');
        grunt.log.ok(str);
        grunt.log.ok('Summary: ' + summary);
        done();
      }
    };

    var retrieveResults = function(response) {
      if (response.statusCode === 200) {
        //yay! Let's process it now
        processData(response);
      } else {
        if (response.statusCode !== curStatus) {
          //we had a problem
          logErrorAndExit(response.statusText);
        }
      }
    };

    var done = this.async(),
        WebPageTest = require('webpagetest'),
        wpt = new WebPageTest(options.wptInstance, options.key),
        reserved = ['key', 'url', 'budget', 'wptInstance'],
        toSend = {};

        for (var item in options) {
          if (reserved.indexOf(item) === -1 && options[item] !== '') {
            toSend[item] = options[item];
          }
        }

        //if repeatView, we need to get repeat
        toSend.firstViewOnly = !options.repeatView;

        if (Object.keys(options.budget).length === 0) {
          //empty budget defined, so error
          logErrorAndExit('Empty budget option provided');
        }

        // run the test
        wpt.runTest(options.url, toSend, function(err, data) {
          if (err) {
            // ruh roh!
            var status;
            if (err.error) {
              //underlying API throws errors inconsistently
              //so we need to do this check

              //custom for timeout because that could be common
              if (err.error.code === 'TIMEOUT') {
                status = 'Test ' + err.error.testId + ' has timed out. You can still view the results online at ' +
                        options.wptInstance + '/results.php?test=' + err.error.testId + '.';
              } else {
                //we'll keep this just in case
                status = 'Test ' + err.error.testId + ' has errored. Error code: ' + err.error.code + '.';
              }
            } else {
              status = err.statusText || (err.code + ' ' + err.message);
            }

            logErrorAndExit(status);
          } else if (data.statusCode === 200) {
            testId = data.data.testId;

            if (data.data.successfulFVRuns <= 0) {
              grunt.log.error( ('Test ' + testId + ' was unable to complete. Please see ' + data.data.summary + ' for more details.').cyan );
            } else {
              // yay! now try to get the actual results
              retrieveResults(data);
            }

          } else {
            // ruh roh! Something is off here.
            grunt.log.error(data.data.statusText);
          }
        });
  });

};
