import type { InitialOptionsTsJest } from "ts-jest"

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  automock: true,
}

export default config
