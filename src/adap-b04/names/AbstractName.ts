import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
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
    MethodFailureException.assertIsNotNullOrUndefined(asStringResult);
    MethodFailureException.assertCondition(
      typeof asStringResult == "string",
      "Result has to be string"
    );
    return asStringResult;
  }

  public toString(): string {
    this.assertClassInvariants();
    const toStringResult = this.asDataString();
    MethodFailureException.assertIsNotNullOrUndefined(toStringResult);
    MethodFailureException.assertCondition(
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
    MethodFailureException.assertIsNotNullOrUndefined(asDataStringResult);
    MethodFailureException.assertCondition(
      typeof asDataStringResult == "string",
      "Result has to be string"
    );
    return asDataStringResult;
  }

  public isEqual(other: Name): boolean {
    IllegalArgumentException.assertIsNotNullOrUndefined(other);
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
    this.assertClassInvariants();
    return this.delimiter;
  }

  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): void;

  abstract insert(i: number, c: string): void;
  abstract append(c: string): void;
  abstract remove(i: number): void;

  public concat(other: Name): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(other);
    this.assertClassInvariants();
    const prevLength = this.getNoComponents();
    const otherLength = other.getNoComponents();
    if (this.getDelimiterCharacter() != other.getDelimiterCharacter()) {
      throw new Error("Delimiters have to match for concat to be possible.");
    }
    for (let i = 0; i < other.getNoComponents(); i++) {
      this.append(other.getComponent(i));
    }
  }

  protected assertIsValidDelChar(d: string) {
    let condition: boolean = d.length == 1;
    IllegalArgumentException.assertCondition(
      condition,
      "invalid delimiter character"
    );
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
    IllegalArgumentException.assertCondition(condition, "Invalid Index");
  }

  protected assertIsValidInsertIndex(i: number) {
    const condition = !(i < 0 || i > this.getNoComponents());
    IllegalArgumentException.assertCondition(condition, "Invalid Index");
  }

  protected assertIsValidComponent(c: String) {
    IllegalArgumentException.assertIsNotNullOrUndefined(c);
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
      }
    }
  }

  protected assertClassInvariants() {
    this.assertIsNotEmptyName();
    this.assertIsValidDelChar(this.delimiter);
  }

  protected assertCloneIsCopyOfOriginalAsPostCondition(clone: Name) {
    MethodFailureException.assertIsNotNullOrUndefined(clone);
    if (!this.isEqual(clone)) {
      throw new MethodFailureException("clone failed");
    }
  }
}
