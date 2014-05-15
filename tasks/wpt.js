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
      key: "",
      location: "Dulles_Nexus5",
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

    var processData = function(data) {
      var budget = options.budget,
          median = data.data.median.firstView,
          pass = true,
          str = "";

      for (var item in budget) {
        // make sure this is objects own property and not inherited
        if (budget.hasOwnProperty(item)) {
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


        wpt.runTest(options.url, {location: options.location, video: 1}, function(err, data) {
          if (err) {
            grunt.log.error(err);
          } else if (data.statusCode === 200) {
            grunt.log.writeln( ('Running test...').cyan );

            testId = data.data.testId;
            grunt.log.writeln( ('Test ID ' + testId + ' obtained....').cyan );
            
            retrieveResults(testId);
          } else {
            grunt.log.error(data.statusText);
          }
        });
  });

};
