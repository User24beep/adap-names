import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", "#");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", "#");
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("AsString tests", () => {
  it("tests asString with escape chars", () => {
    let n: Name = new StringName("cs.fau\\.oss.de", ".");
    let an: Name = new StringArrayName(["cs", "fau\\.oss", "de"], ".");
    expect(n.asString("#")).toBe(an.asString("#"));
  });
});

describe("AsDataString test1", () => {
  it("tests asDatastring with escape chars", () => {
    let n: Name = new StringName("fau\\.oss.cs.de", ".");
    let an: Name = new StringArrayName(["fau\\.oss", "cs", "de"], ".");
    expect(n.asDataString()).toBe(an.asDataString());
  });
});

describe("append Test Advanced", () => {
  it("tests append with escape chars", () => {
    let n: Name = new StringName("oss.cs.fau.de", ".");
    let an: Name = new StringArrayName(["oss", "cs", "fau", "de"], ".");
    n.append("test\\\\test");
    an.append("test\\\\test");
    expect(n.asDataString()).toBe(an.asDataString());
    expect(n.asString()).toBe(an.asString());
  });
});
