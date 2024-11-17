import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.delimiter = delimiter;
  }

  public asString(delimiter: string = this.delimiter): string {
    let components: Array<string> = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      components.push(this.unescapeComponent(this.getComponent(i)));
    }
    return components.join(delimiter);
  }

  public toString(): string {
    return this.asDataString();
  }

  public asDataString(): string {
    let components: Array<string> = [];
    for (let i = 0; i < this.getNoComponents(); i++) {
      components.push(this.getComponent(i));
    }
    return components.join(this.getDelimiterCharacter());
  }

  public isEqual(other: Name): boolean {
    return this.getHashCode() == other.getHashCode();
  }

  public getHashCode(): number {
    let hashCode: number = 0;
    const s: string = this.asDataString();
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i);
      hashCode = (hashCode << 5) - hashCode + c;
      hashCode |= 0;
    }
    return hashCode;
  }

  public clone(): Name {
    let cloneInstance = Object.create(this.constructor.prototype);
    cloneInstance.delimiter = this.delimiter;
    for (let i = 0; i < this.getNoComponents(); i++) {
      cloneInstance.append(this.getComponent(i));
    }
    return cloneInstance;
  }

  public isEmpty(): boolean {
    return this.getNoComponents() == 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): void;

  abstract insert(i: number, c: string): void;
  abstract append(c: string): void;
  abstract remove(i: number): void;

  public concat(other: Name): void {
    if (this.getDelimiterCharacter() != other.getDelimiterCharacter()) {
      throw new Error("Delimiters have to match for concat to be possible.");
    }
    for (let i = 0; i < other.getNoComponents(); i++) {
      this.append(other.getComponent(i));
    }
  }

  //helper-function for asString
  private unescapeComponent(component: string): string {
    return component.replaceAll(ESCAPE_CHARACTER, "");
  }
}
