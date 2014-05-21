# grunt-perfbudget

> Grunt task for Performance Budgeting

### Performance budgeting thanks to the magic of WebPageTest

grunt-perfbudget is a [Grunt.js](https://github.com/cowboy/grunt/) task for enforcing a performance budget. It uses the wonderful [webpagetest.org](http://webpagetest.org) and the [WebPageTest API Wrapper for NodeJS](https://github.com/marcelduran/webpagetest-api) created by [Marcel Duran](https://github.com/marcelduran).

grunt-perfbudget uses either a public or private instance of WebPageTest to perform tests on a specified URL. It compares test results to budgets you specify. If the budget is met, the tasks successfully completes. If it the page exceeds your performance budgets, the task fails and informs you why.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-perfbudget --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-perfbudget');
```

## The "wpt" task

### Overview
In your project's Gruntfile, add a section named `perfbudget` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  perfbudget: {
    options: {
      // Task-specific options go here.
    }
  },
});
```

### Options

### Usage Examples

#### Default Options


#### Custom Options


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
