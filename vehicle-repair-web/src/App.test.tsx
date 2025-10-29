import { describe, it } from "vitest";
import App from "./App";
import { render } from "./utils/config-test";

describe("App", () => {
  it("renders", () => {
    render(<App />);
  });
});
