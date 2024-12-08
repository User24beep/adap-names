import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.assertIsValidDelChar(delimiter);
    this.delimiter = delimiter;
  }

  public clone(): Name {
    this.assertClassInvariants();
    let cloneData = structuredClone(this);
    let cloneType = Object.create(Object.getPrototypeOf(this));
    let cloneInstance = Object.assign(cloneType, cloneData);
    this.assertCloneIsCopyOfOriginalAsPostCondition(cloneInstance);
    return cloneInstance;
  }

  public asString(delimiter: string = this.delimiter): string {
    this.assertIsValidDelChar(delimiter);
    this.assertClassInvariants();
    let components: Array<string> = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      components.push(this.unescapeComponent(this.getComponent(i)));
    }
    const asStringResult = components.join(delimiter);
    MethodFailedException.assert(
      asStringResult != null && asStringResult != undefined,
      "asStringResult cannot be null or undefined"
    );
    MethodFailedException.assert(
      typeof asStringResult == "string",
      "Result has to be string"
    );
    return asStringResult;
  }

  public toString(): string {
    this.assertClassInvariants();
    const toStringResult = this.asDataString();
    MethodFailedException.assert(
      toStringResult != null && toStringResult != undefined,
      "toStringResult cannot be null or undefined"
    );
    MethodFailedException.assert(
      typeof toStringResult == "string",
      "Result has to be string"
    );
    return toStringResult;
  }

  public asDataString(): string {
    this.assertClassInvariants();
    let components: Array<string> = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      components.push(this.getComponent(i));
    }
    const asDataStringResult = components.join(this.getDelimiterCharacter());
    MethodFailedException.assert(
      asDataStringResult != null && asDataStringResult != undefined,
      "asDataStringResult cannot be null or undefined"
    );
    MethodFailedException.assert(
      typeof asDataStringResult == "string",
      "Result has to be string"
    );
    return asDataStringResult;
  }

  public isEqual(other: Name): boolean {
    IllegalArgumentException.assert(
      other != null && other != undefined,
      "other cannot be null or undefined"
    );
    this.assertClassInvariants();
    return this.getHashCode() == other.getHashCode();
  }

  public getHashCode(): number {
    this.assertClassInvariants();
    let hashCode: number = 0;
    const s: string = this.asDataString();
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i);
      hashCode = (hashCode << 5) - hashCode + c;
      hashCode |= 0;
    }
    return hashCode;
  }

  public isEmpty(): boolean {
    this.assertClassInvariants();
    return this.getNoComponents() == 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): Name;

  abstract insert(i: number, c: string): Name;
  abstract append(c: string): Name;
  abstract remove(i: number): Name;
  abstract concat(other: Name): Name;

  protected assertIsValidDelChar(d: string) {
    let condition: boolean = d.length == 1;
    IllegalArgumentException.assert(condition, "invalid delimiter character");
  }

  //helper-function for asString
  private unescapeComponent(component: string): string {
    return component.replaceAll(ESCAPE_CHARACTER, "");
  }

  protected assertIsValidName(): void {
    this.assertIsValidDelChar(this.delimiter);
  }

  protected assertIsNotEmptyName() {
    if (this.getNoComponents() === 0) {
      throw new InvalidStateException("Name cannot be empty.");
    }
  }

  protected assertIsValidIndex(i: number) {
    const condition = !(i < 0 || i >= this.getNoComponents());
    IllegalArgumentException.assert(condition, "Invalid Index");
  }

  protected assertIsValidInsertIndex(i: number) {
    const condition = !(i < 0 || i > this.getNoComponents());
    IllegalArgumentException.assert(condition, "Invalid Index");
  }

  protected assertIsValidComponent(c: String) {
    MethodFailedException.assert(
      c != null && c != undefined,
      "c cannot be null or undefined"
    );
    let escaped = false;
    let currentChar = "";
    for (let i = 0; i < c.length; i++) {
      currentChar = c.charAt(i);
      if (escaped) {
        escaped = false;
      } else {
        if (currentChar == this.getDelimiterCharacter()) {
          throw new IllegalArgumentException("c is not a valid component");
        }
        if (currentChar == ESCAPE_CHARACTER) {
          escaped = true;
        }
      }
    }
  }

  protected assertClassInvariants() {
    this.assertIsNotEmptyName();
    this.assertIsValidDelChar(this.delimiter);
  }

  protected assertCloneIsCopyOfOriginalAsPostCondition(clone: Name) {
    MethodFailedException.assert(
      clone != null && clone != undefined,
      "clone cannot be null or undefined"
    );
    if (!this.isEqual(clone)) {
      throw new MethodFailedException("clone failed");
    }
  }
}
