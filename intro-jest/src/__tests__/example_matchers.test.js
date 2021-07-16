// Matchers allow us to make assertions in different ways
// Matchers: https://jestjs.io/docs/using-matchers
// All matchers startUp with expect(), and expect() returns other methods that we can chain
describe("matchers", () => {
  // toBe tests exact equality by using Object.is
  test("toBe", () => {
    expect(true).toBe(true);
  });

  // toEqual allows us to test the value of objects or arrays (it fails if we use toBe)
  test("toEqual", () => {
    const data = { one: 1 };
    data["two"] = 2;
    expect(data).toEqual({ one: 1, two: 2 });

    const arr = ["one", "two"];
    expect(arr).toEqual(["one", "two"]);
  });

  // not. allows us to modify the matcher like the ! operator
  test("not.toBe", () => {
    const bool = true;
    expect(bool).not.toBe(false);
  });

  // toMatch allows us to check strings against regular expressions
  test("not.toMatch", () => {
    expect("team").not.toMatch(/I/);
  });

  // toThrow allows us to test whether a function throws an error
  test("toThrow", () => {
    // expect(() => compileAndroidCode()).toThrow();
    // expect(() => compileAndroidCode()).toThrow(Error);
    // You can also use the exact error message or a regexp
    // expect(() => compileAndroidCode()).toThrow("you are using the wrong JDK");
    // expect(() => compileAndroidCode()).toThrow(/JDK/);
  });
});

// GIVEN CODE
// describe('matchers', () => {
//   test('toBe', () => {
//     expect(true).toBe(true);
//   });

//   test('toEqual', () => {
//     const data = {one: 1};
//     data['two'] = 2;
//     expect(data).toEqual({one: 1, two: 2});

//     const arr = ['one', 'two'];
//     expect(arr).toEqual(['one', 'two']);
//   });

//   test('not', () => {
//     expect(true).not.toBe(false);
//   });

//   test('string', () => {
//     expect('team').not.toMatch(/I/);
//   });

//   test('thrown', () => {
//     // expect(compileAndroidCode).toThrow();
//     // expect(compileAndroidCode).toThrow(Error);

//     // // You can also use the exact error message or a regexp
//     // expect(compileAndroidCode).toThrow('you are using the wrong JDK');
//     // expect(compileAndroidCode).toThrow(/JDK/);
//   });
// });
