// here is an example of how to mock storage
import { storage } from "../lib/storage";
import { getUsername, saveUsername } from "../user";
jest.mock("../lib/storage"); // It replaces the ES6 module with a mock constructor, and replaces all of its methods with mock functions that return undefined by default. Methods are kept, but inside they are turned into mocks. This jest.mock is automatically hoisted to the top by jest, before any imports.

test("first example", () => {
  //const myMock = jest.fn(); // returns a mock, but the function returns undefined by default

  // we can make the function return a value with .mockReturnValueOnce()
  const myMock = jest
    .fn()
    .mockReturnValueOnce(true)
    .mockReturnValueOnce("hello world")
    .mockReturnValueOnce(5);

  const result1 = myMock();
  const result2 = myMock();
  const result3 = myMock();

  expect(myMock).toHaveBeenCalledTimes(3);

  expect(result1).toBe(true);
  expect(result2).toBe("hello world");
  expect(result3).toBe(5);
});

test("second example", () => {
  // we want to test save and get methods, but we need to mock storage
  // console.log("storage", storage);
  const username = "john doe";
  saveUsername(username);
  expect(storage.save).toHaveBeenCalled();
  expect(storage.save).toHaveBeenCalledTimes(1);
  expect(storage.save).toHaveBeenCalledWith({
    key: "username",
    value: username,
  });
});

test("third example", () => {
  // we want to test save and get methods, but we need to mock storage with jest.mock("../lib/storage")
  // console.log("storage", storage);
  const username = "john doe";
  storage.get.mockReturnValueOnce(username);

  const result = getUsername();

  expect(result).toBe(username);
  expect(storage.get).toHaveBeenCalled();
  expect(storage.get).toHaveBeenCalledTimes(1);
  expect(storage.get).toHaveBeenCalledWith({ key: "username" });
  // expect(storage.get).toEqual(result);
});

// GIVEN CODE
// import { storage } from '../lib/storage';
// import { saveUsername, getUsername } from '../user';

// jest.mock('../lib/storage');

// test('first example', () => {
//   const myMock = jest.fn()
//     .mockReturnValueOnce(true)
//     .mockReturnValueOnce('hello world')
//     .mockReturnValueOnce(5);

//   const result1 = myMock();
//   const result2 = myMock();
//   const result3 = myMock();

//   expect(myMock).toHaveBeenCalledTimes(3);

//   expect(result1).toBe(true);
//   expect(result2).toBe('hello world');
//   expect(result3).toBe(5);
// });

// test('second example', () => {
//   const username = 'john doe';
//   saveUsername(username);
//   expect(storage.save).toHaveBeenCalledTimes(1);
//   expect(storage.save).toHaveBeenCalledWith({ key:'username', value: username });
// });

// test('third example', () => {
//   const username = 'john doe';
//   storage.get.mockReturnValueOnce(username);

//   const result = getUsername();

//   expect(result).toBe(username)
//   expect(storage.get).toHaveBeenCalledTimes(1);
//   expect(storage.get).toHaveBeenCalledWith({ key:'username' });
// });
