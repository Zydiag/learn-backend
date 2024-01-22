# Learning Backend using Nodejs

<details>
<summary>using asyncHandler</summary>
 This code defines a higher-order function called `asyncHandler`, which takes another function `fn` as its argument. `asyncHandler` returns a new asynchronous function that is intended to be used as middleware in an Express.js application.

Here's a breakdown of how it works:

1. it accepts a `fn` but to call the same function again we do something like this:
   ```javascript
   const asyncHandler = () => {}
   // const asyncHandler = () => {() => {}} --> not valid
   const asyncHandler = () => () => {}
   const asyncHandler = (fn) => fn
   const asyncHandler = (fn) => () => fn
   ```
   `const asyncHandler = (fn) => () => fn:`
   This is valid. It takes a function fn as an argument and returns a new function that, when called, executes the original function fn. Again, it doesn't implement any asynchronous behavior or error handling by itself.
   </details>
