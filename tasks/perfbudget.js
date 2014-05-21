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
      url: '',
      key: '',
      location: "Dulles_Nexus5",
      wptInstance: "www.webpagetest.org",
      connectivity: '',
      bandwidthDown: '',
      bandwidthUp: '',
      latency: '',
      packetLossRate: '',
      budget: {
        visualComplete: '4000',
        render: '1000',
        loadTime: '',
        docTime: '',
        fullyLoaded: '',
        bytesOut: '',
        bytesOutDoc: '',
        bytesIn: '',
        bytesInDoc: '',
        requests: '', 
        requestsDoc: '',
        domTime: '',
        SpeedIndex: '1000'
      }
    });

    var testId,
        curStatus,
        myTimer;

    // takes the data returned by wpt.getTestResults and compares 
    // to our budget thresholds
    var processData = function(data) {
      var budget = options.budget,
          median = data.data.median.firstView,
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

      //output our header and results
      if (!pass) {
        grunt.log.error('\n\n-----------------------------------------------' +
              '\nTest for ' + options.url + ' \t  FAILED' +
            '\n-----------------------------------------------\n\n');
        grunt.log.error(str);
      } else {
        grunt.log.ok('\n\n-----------------------------------------------' +
              '\nTest for ' + options.url + ' \t  PASSED' +
            '\n-----------------------------------------------\n\n');
        grunt.log.ok(str);
      }
      
    };

    var retrieveResults = function() {
      var response;
      // try to get the results for the test
      wpt.getTestResults(testId, function(err, data) {
        response = data.response;
        if (response.statusCode === 200) {
          //yay! Let's process it now
          processData(response); 
        } else {
          if (response.statusCode !== curStatus) {
            //update status so folks now we haven't died on them
            grunt.log.writeln( (response.statusText + '...').cyan );
            curStatus = response.statusCode;
          }
          //check again later
          myTimer = setTimeout(function(testId) {
            retrieveResults(testId);
          }, 1000);
        }
      });
    };
    var done = this.async(),
        WebPageTest = require('webpagetest'),
        wpt = new WebPageTest(options.wptInstance, options.key),
        err, data;

        // run the test
        wpt.runTest(options.url, {location: options.location, video: 1}, function(err, data) {
          if (err) {
            // ruh roh!
            grunt.log.error(err);
          } else if (data.statusCode === 200) {
            // yay! Let's let them know the test is running.
            grunt.log.writeln( ('Running test...').cyan );

            testId = data.data.testId;
            //and we have an ID!
            grunt.log.writeln( ('Test ID ' + testId + ' obtained....').cyan );
            
            //now try to get the actual results
            retrieveResults(testId);
          } else {
            // ruh roh! Something is off here.
            grunt.log.error(data.statusText);
          }
        });
  });

};
