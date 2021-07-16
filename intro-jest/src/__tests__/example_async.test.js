// callbacks
const asyncCallback = (cb) => {
  setTimeout(() => {
    cb(true);
  }, 1000);
};

// promises
const asyncPromise = () => new Promise((resolve) => resolve(true));

// async tests
describe("async code", () => {
  // testing a callback
  test("example of async with callback", (done) => {
    // this test will be a false positive, because jest doesn't know this is async code. The way we can see this test throwing a false positive is by passing false instead of true to the callback, and seeing how the test passes anyway. The test even passes if we comment out the following lines.
    // The way to solve this and make the test work is to pass the "done" param, which is a function that causes jest to wait until the done callback is called before finishing the test.
    asyncCallback((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  // testing a promise
  test("example of async with promises", () => {
    return asyncPromise().then((result) => expect(result).toBe(true));
  });

  // another way of testing promises
  test.only("example of async with async await", async () => {
    const result = await asyncPromise();
    expect(result).toBe(true);
  });

  // and there is also another way of testing promises, with .resolves/ .rejects
});

// GIVEN CODE
// // callbacks
// const asyncCallback = (cb) => {
//   setTimeout(() => {
//     cb(true);
//   }, 1000);
// };

// // promises
// const asyncPromise = () => new Promise((resolve) => resolve(true));

// describe('async code', () => {
//   test('example of async with callback', (done) => {
//     asyncCallback((result) => {
//       expect(result).toBe(true);
//       done();
//     });
//   });

//   test('example of async with promises', () => {
//     return asyncPromise().then((result) => expect(result).toBe(true));
//   });

//   test('example of async with async await', async () => {
//     const result = await asyncPromise();
//     expect(result).toBe(true);
//   });
// });
