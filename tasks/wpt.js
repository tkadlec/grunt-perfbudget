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
      location: "Dulles_Nexus5"
    });
    var done = this.async(),
        WebPageTest = require('webpagetest'),
        wpt = new WebPageTest('www.webpagetest.org', options.key),
        err, data;

        grunt.log.writeln( ('Running test...').cyan );
        wpt.runTest(options.url, {location: options.location}, function(err, data) {
          if (data.statusCode === 200) {
            grunt.log.writeln( ('Test ID ' + data.data.testId + ' obtained....').cyan );
          }
        });
  });

};
