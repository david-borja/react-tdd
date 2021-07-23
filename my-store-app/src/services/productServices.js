export const saveProduct = ({name, size, type}) =>
  // we directly return fetch, which returns a promise
  fetch('/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({name, size, type}),
  })

// if we don't pass anything into the request body, this would be enough:
// fetch('/products', {
//   method: 'POST',
//   body: JSON.stringify({}),
// })
// due to the eslint config, we need to do an export default. We decide to export an object, so we can import functions granularly (I don't really understand this, because the import with keys also works if we just write 'export default saveProduct')
export default {saveProduct}
