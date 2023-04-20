import { generatePDF } from "../src/utils/generatePDF";
import { Template } from "../src/utils/types";

describe("🚀 General", () => {
  test("Should generate a PDF", () => {
    return generatePDF("foo", "bar", [], Template.blank).then((data) => {
      expect(data).not.toBeNull();
    });
  });
});
