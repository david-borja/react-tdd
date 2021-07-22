import React from "react";
import { render, screen } from "@testing-library/react";

import AsyncList from "./async-list";

test("show the food data", async () => {
  render(<AsyncList />);

  // getByText is a method that runs synchronously
  // const hamburger = await screen.getByText(/hamburger/i);

  // findByText is a method that returns a promise, so it's useful to test async code
  const hamburger = await screen.findByText(/hamburger/i);

  // probably we don't need this expect, because if after some time findByText doesn't find anything is, that is gonna fail the test already. However, it makes sense to write the expect anyway because it is a bit more clear what the purpose of the test is.
  expect(hamburger).toBeInTheDocument();
  expect(await screen.findByText(/pizza/i)).toBeInTheDocument();
  expect(await screen.findByText(/tacos/i)).toBeInTheDocument();
});

// GIVEN CODE
// import React from 'react';
// import { render, screen } from '@testing-library/react';

// import AsyncList from './async-list';

// test('show the food data', async () => {
//   render(<AsyncList />);

//   const hamburguer = await screen.findByText(/hamburger/i);

//   expect(hamburguer).toBeInTheDocument();

//   expect(await screen.findByText(/pizza/i)).toBeInTheDocument();
//   expect(await screen.findByText(/tacos/i)).toBeInTheDocument();
// });
