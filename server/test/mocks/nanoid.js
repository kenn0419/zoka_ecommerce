module.exports = {
  customAlphabet: () => () => 'mocked-nanoid-' + Math.floor(Math.random() * 1000),
  nanoid: () => 'mocked-nanoid-' + Math.floor(Math.random() * 1000)
};
