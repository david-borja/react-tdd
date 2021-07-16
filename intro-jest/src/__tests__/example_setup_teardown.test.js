describe("setup and teardown examples", () => {
  // beforeAll runs before executing all tests
  beforeAll(() => {
    console.log("beforeAll");
  });

  // beforeEach runs before executing each test
  beforeEach(() => {
    console.log("beforeEach");
  });

  // runs after all tests
  afterAll(() => {
    console.log("afterAll");
  });

  // runs after each test
  afterEach(() => {
    console.log("afterEach");
  });

  test("example 1", () => {
    expect(true).toBe(true);
  });

  test("example 2", () => {
    expect(true).toBe(true);
  });

  // we might need to do a setup to mock some data or prepare what we are going to test. In other words, when we need to assign initial values, instead of repeating it for each test, we can encapsulate it.
});

// GIVEN CODE
// describe('setup and teardown examples', () => {
//   beforeAll(() => {
//     console.log('beforeAll');
//   });

//   beforeEach(() => {
//     console.log('beforeEach');
//   });

//   afterAll(() => {
//     console.log('afterAll');
//   });

//   afterEach(() => {
//     console.log('afterEach');
//   });

//   test('example 1', () => {
//     expect(true).toBe(true);
//   });

//   test('example 2', () => {
//     expect(true).toBe(true);
//   });
// });
