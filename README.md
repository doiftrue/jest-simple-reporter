Jest Text Reporter
==================
Simple text reporter for Jest that creates a report in a TXT file.


Installing
----------
```
npm install --save-dev jest-text-reporter
```


Getting Started
---------------
To use this reporter, you will need to have a Jest test environment set up.

Add the reporter in your `jest.config.js` like so:

```js
{
	//...
	reporters: [
		'default',
		['<rootDir>/index.js', {
			outputFile: 'tmp/report/tests-report.txt',
			truncateMsg: 1000,
		}],
	],
	//...
}
```

Or in `package.json` if your Jest config is there:
```json
{
  "jest": {
    "bail": false,
    "reporters": [
      "default",
      [
        "<rootDir>/node_modules/jest-text-reporter", {
          "outputFile": "tmp/report/tests-report.txt",
          "truncateMsg": 1000
        }
      ]
    ]
  }
}
```


Options
-------

| Option               | Value    | Description                                                               |
|----------------------|----------|---------------------------------------------------------------------------|
| `outputFile`         | `string` | Path to the output file. Default: './tests.txt'                           |
| `truncateMsg`        | `number` | Number of characters to truncate long messages to. Default: 1000          |
| `nameRelatify`       | `bool`   | Should test file path (suite name) be relative to root. Default: true     |
| `nameRelatifyRegexp` | `string` | Additional regex applied after `nameRelatify` is implemented. Default: '' |
| `showDuration`       | `bool`   | Add duration info next to testcase. Default: true                         |


Report Example
--------------
```text
REPORT form 25 Nov 2024, 02:57

| 0.333 sec  | ✓ Passed | ✗ Failed | • Pending |
| ---------- | -------- | -------- | --------- |
| Suites (2) | 1        | 1        | 0         |
| Tests (9)  | 8        | 1        | 1         |


sample1.test.js

  PASSED
    ✔ adds 1 + 2 to equal 3  (3 ms)

  [Group (level 1)]
    PASSED
      ✔ multiplication works  (1 ms)
      ✔ division works  (0 ms)

  [Group two (level 1)]
    [Group level 2]
      PASSED
        ✔ joins two strings  (0 ms)
        ✔ calculates string length  (1 ms)



sample2.test.js

  FAILED
    ✘ this test should fail  (4 ms)
      Error: expect(received).toBe(expected) // Object.is equality

      Expected: 5
      Received: 10
          at Object.toBe (/app/__tests__/sample2.test.js:4:18)
          at Promise.then.completed (/app/node_modules/jest-circus/build/utils.js:298:28)
          at new Promise (<anonymous>)
          at callAsyncCircusFn (/app/node_modules/jest-circus/build/utils.js:231:10)
          at _callCircusTest (/app/node_modules/jest-circus/build/run.js:316:40)
          at processTicksAndRejections (node:internal/process/task_queues:105:5)
          at _runTest (/app/node_modules/jest-circus/build/run.js:252:3)
          at _runTestsForDescribeBlock (/app/node_modules/jest-circus/build/run.js:126:9)
          at run (/app/node_modules/jest-circus/build/run.js:71:3)
          at runAndTransformResultsToJestFormat (/app/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
          at jestAdapter (/app/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapte...


  PASSED
    ✔ async test example  (0 ms)

  [describe group level 1]
    PASSED
      ✔ Test: value after beforeEach  (0 ms)
      ✔ Test: value resets after afterEach  (1 ms)
```