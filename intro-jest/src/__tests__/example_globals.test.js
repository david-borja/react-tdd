// both expect() and test() are global methods
// the test method has an alias -> it(), so test() and it() can be used interchangeably
// describe is another global method, and groups tests
// toBe is a matcher
// description names have to be different
// there are other global methods: https://jestjs.io/docs/api

describe("this groups test cases", () => {
  test("description", () => {
    expect(true).toBe(true);
  });
  test("description 2", () => {
    expect(true).toBe(true);
  });
  test("description 3", () => {
    expect(true).toBe(true);
  });
});

// GIVEN CODE
// describe("this is for group test cases", () => {
//   it("description", () => {
//     expect(true).toBe(true);
//   });

//   it("description 2", () => {
//     expect(true).toBe(true);
//   });

//   it("description 3", () => {
//     expect(true).toBe(true);
//   });
// });
