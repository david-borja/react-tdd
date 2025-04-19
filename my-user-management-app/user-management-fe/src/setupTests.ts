// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

import {queryClient} from 'mocks/render-with-providers'
import {server} from './mocks/server'

// react-query cachea los request
// para limpiar la caché y que lance todas las peticiones para los test, hay que usar queryClient.clear() antes de cada test
beforeEach(() => queryClient.clear())

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())
