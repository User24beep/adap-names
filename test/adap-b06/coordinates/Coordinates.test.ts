import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

describe("concat test", () => {
  it("test equality on StringName and StringArrayName", () => {
    let sn: Name = new StringArrayName(["oss", "cs", "fau", "de"], ".");
    let n = sn.concat(new StringArrayName(["oss", "cs", "fau", "de"], "."));
    expect(n.asDataString()).toBe("oss.cs.fau.de.oss.cs.fau.de");
  });
});

describe("Equality test", () => {
  it("test equality on StringName and StringArrayName", () => {
    let sn: Name = new StringName("fau.cs", ".");
    let san: Name = new StringArrayName(["fau", "cs"], ".");
    let n1 = sn.append("test\\.test");
    let n2 = san.append("test\\.test");
    expect(n1.isEqual(n2)).toBe(true);
  });
});

describe("mutation test", () => {
  it("append", () => {
    let sn: Name = new StringName("fau.cs", ".");
    let san: Name = new StringArrayName(["fau", "cs"], ".");
    let n = san.insert(0, "test");
  });
});

describe("Invalid state", () => {
  it("remove til empty", () => {
    let sn: Name = new StringName("fau.cs", ".");
    let san: Name = new StringArrayName(["fau", "cs"], ".");
    let n1 = sn.remove(0);
    let n2 = n1.append("as");
    let n3 = n2.remove(0);

    expect(n3.isEqual(new StringName("as"))).toBe(true);
    expect(sn.isEqual(san)).toBe(true);
  });
});
