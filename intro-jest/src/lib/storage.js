export const storage = {
  // save and get are methods
  save({ key, value }) {
    return localStorage.setItem(key, value);
  },
  get({ key }) {
    return localStorage.getItem(key);
  },
};
