# grunt-perfbudget

> Grunt task for Performance Budgeting

### Performance budgeting thanks to the magic of WebPageTest

grunt-perfbudget is a [Grunt.js](https://github.com/cowboy/grunt/) task for enforcing a performance budget ([more on performance budgets](http://timkadlec.com/2013/01/setting-a-performance-budget/)). It uses the wonderful [webpagetest.org](http://webpagetest.org) and the [WebPagetest API Wrapper for NodeJS](https://github.com/marcelduran/webpagetest-api) created by [Marcel Duran](https://github.com/marcelduran).

grunt-perfbudget uses either a public or private instance of WebPagetest to perform tests on a specified URL. It compares test results to budgets you specify. If the budget is met, the tasks successfully completes. If it the page exceeds your performance budgets, the task fails and informs you why.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-perfbudget --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-perfbudget');
```

## The "perfbudget" task

### Required configuration properties

While grunt-perfbudget provides defaults for most configurable options, it does require the URL to be tested, as well as an API key to use if testing against the public instance of WebPagetest. For more information on obtaining a key, [see this thread](http://www.webpagetest.org/forums/showthread.php?tid=466) on the WebPagetest forums.

These can be set in your Gruntfile.js config file like so:

```javascript
perfbudget: {
  default: {
    options: {
      url: 'http://google.com',
      key: 'API_KEY_HERE'
    }
  }
}
```

With these configuration properties set, you can add `perfbudget` to your default tasks list. That'll look something like this:

    grunt.registerTask('default', ['jshint', 'perfbudget']);

With this in place, grunt-perfbudget will now test your site against the default performance budget settings to see if you're passing.


### Options

grunt-perfbudget takes the following options:

#### options.output

Type `String`
Default value: NONE

The file to output the JSON results to.

#### options.url

Type `String`
Default value: NONE

The url you want to perform the tests on.

#### options.key

Type `String`
Default value: NONE

The API Key for the public instance of WPT. *Not needed if using a private instance of webpagetest*

#### options.location

Type `String`
Default value: 'Dulles_Nexus5'

The default WPT location/device to conduct the test using.

#### options.wptInstance

Type `String`
Default value: 'www.webpagetest.org'

The WPT instance to conduct the tests with.

#### options.pollResults

Type `Number`
Default value: 5

The frequency (in seconds) to poll for results after the test has been scheduled.

#### options.timeout

Type `Number`
Default value: 60

Timeout (in seconds) for the tests to run.

#### options.connectivity

Type `String`
Default value: NONE

The connectivity profile to use. WPT provides the following options: Cable, DSL, FIOS, Dial, 3G, Native, custom.

#### options.bandwidthDown

Type `String`
Default value: NONE

The download bandwith in Kbps. *Used when connectivity is set to `custom`.*

#### options.bandwidthUp

Type `String`
Default value: NONE

The upload bandwith in Kbps. *Used when connectivity is set to `custom`.*

#### options.latency

Type `String`
Default value: NONE

The RTT latency in milliseconds. *Used when connectivity is set to `custom`.*

#### options.packetLossRate

Type `String`
Default value: NONE

The package loss rate (percentage of packets to drop). *Used when connectivity is set to `custom`.*

#### options.repeatView

Type `Boolean`
Default value: `false`

If set to `true`, tests the budget against the repeat view. *By default, perfbudget tests the budget against the first view and doesn't ask WPT to run a test on the repeat view.*

#### options.login

Type `String`
Default value: NONE

Username for authenticating tests.

#### options.password

Type `String`
Default value: NONE

Password for authenticating tests.

#### options.authenticationType

Type `Number`
Default value: 0

Type of authentication. 0 = Basic, 1 = SNS.

#### options.runs

Type `Number`
Default value: 1

Number of test runs. *If the test is run more more than once, the budget is tested against the median result of the runs.*

#### options.budget

Type `Object`

Allows you to specify a performance budget. *If the test is run more more than once, the budget is tested against the median result of the runs.*

The variables you can use as a budget include:

##### budget.visualComplete

Type `String`
Default value: NONE

The budget for visually complete in millseconds.

##### budget.render

Type `String`
Default value: 1000

The budget for start render time in millseconds.

##### budget.loadTime

Type `String`
Default value: NONE

The budget for load time in millseconds.

##### budget.docTime

Type `String`
Default value: NONE

The budget for `document.complete` in millseconds.

##### budget.fullyLoaded

Type `String`
Default value: NONE

The budget for fully loaded time in millseconds.

##### budget.bytesIn

Type `String`
Default value: NONE

The budget for overall weight in bytes.

##### budget.bytesInDoc

Type `String`
Default value: NONE

The budget for number of bytes downloaded before the Document Complete time.

##### budget.requests

Type `String`
Default value: NONE

The budget for overall number of requests.

##### budget.requestsDoc

Type `String`
Default value: NONE

The budget for number of requests made before the Document Complete time.

##### budget.SpeedIndex

Type `String`
Default value: 1000

The budget for calculated SpeedIndex.

##### budget.userTime

Type `String`
Default value: NONE

The budget for the final user timing mark recorded on the page.

You can test against a specific user timing mark like so:

```javascript
perfbudget: {
  default: {
    options: {
      url: 'http://google.com',
      key: 'API_KEY_HERE',
      budget: {
		'userTime.CUSTOM_MARK': '1500'
      }
    }
  }
}
```

For more information on User Timing, see [http://www.w3.org/TR/user-timing/](http://www.w3.org/TR/user-timing/)
### Usage Examples

#### 1. Test http://google.com against default budget settings

```javascript
perfbudget: {
  default: {
    options: {
      url: 'http://google.com',
      key: 'API_KEY_HERE'
    }
  }
}
```

#### 2. Test http://google.com using custom budget for SpeedIndex and Visually Complete

```javascript
perfbudget: {
  default: {
    options: {
      url: 'http://google.com',
      key: 'API_KEY_HERE',
      budget: {
		visualComplete: '4000',
		SpeedIndex: '1500'
      }
    }
  }
}
```

#### 3. Test URL using custom budget and private WPT Instance

```javascript
perfbudget: {
  default: {
    options: {
      url: 'http://google.com',
      wptInstance: 'http://PRIVATE_INSTANCE.com',
      budget: {
		visualComplete: '4000',
		SpeedIndex: '1500'
      }
    }
  }
}
```

#### 4. Test http://google.com using a custom budget against the median result of 5 test runs.

```javascript
perfbudget: {
  default: {
    options: {
      url: 'http://google.com',
      key: 'API_KEY_HERE',
      runs: 5,
      budget: {
		visualComplete: '4000',
		SpeedIndex: '1500'
      }
    }
  }
}
```

#### 5. Test http://google.com against default budget settings and output the results to a file.

```javascript
perfbudget: {
  default: {
    options: {
      url: 'http://google.com',
      key: 'API_KEY_HERE',
      output: 'wpt-results.json'
    }
  }
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- Version 0.1.3: Bug fix for custom options. Now includes ability to use HTTP authentication on tests.
- Version 0.1.4: Ability to define custom number of test runs.
- Version 0.1.5: Improved polling using the underlying API. Users can now set polling frequency as well as a timeout for tests.
- Version 0.1.6: Ability to test budget against repeat views; minor bug fixes; better error handling.
- Version 0.1.7: Improved error handling.
- Version 0.1.8: Ability to output results to JSON; bug fixes; improved error handling.
- Version 0.1.9: Security improvements. Also changing default instance of WPT to use https now that the site supports it.