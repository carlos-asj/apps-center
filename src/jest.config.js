const jestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>"],
  verbose: true,
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
};

module.exports = jestConfig;