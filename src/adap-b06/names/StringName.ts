import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(source: string, delimiter?: string) {
    super();
    if (delimiter) {
      this.assertIsValidDelChar(delimiter);
      this.delimiter = delimiter;
    }
    this.name = source;
    let escaped: boolean = false;
    this.noComponents = 1;
    for (let i = 0; i < source.length; i++) {
      //adds +1 to length if a delimiter is found that is not escaped
      // . -> +1
      // \. -> +0
      // \\. -> +1
      // \\\. -> +0
      // \\\\. -> +1
      if (escaped == false && source.charAt(i) == ESCAPE_CHARACTER) {
        escaped = true;
        continue;
      }
      if (escaped == false && source.charAt(i) == this.delimiter) {
        this.noComponents += 1;
        continue;
      }
      escaped = false;
    }
    this.assertClassInvariants();
  }

  public getNoComponents(): number {
    return this.noComponents;
  }

  public getComponent(i: number): string {
    this.assertIsValidIndex(i);
    this.assertClassInvariants();
    const components = this.splitEscaped(this.delimiter);
    return components[i];
  }

  public setComponent(i: number, c: string) {
    this.assertIsValidIndex(i);
    this.assertIsValidComponent(c);
    this.assertClassInvariants();
    let newComponents = this.splitEscaped(this.delimiter);
    newComponents[i] = c;
    let newName = new StringName(
      newComponents.join(this.delimiter),
      this.delimiter
    );
    MethodFailedException.assert(
      newName.getComponent(i) == c,
      "setComponent failed"
    );
    return newName;
  }

  public insert(i: number, c: string) {
    this.assertIsValidIndex(i);
    this.assertIsValidComponent(c);
    this.assertClassInvariants();
    let newComponents = this.splitEscaped(this.delimiter);
    newComponents[i] = c;
    newComponents.splice(i, 0, c);
    let newName = new StringName(
      newComponents.join(this.delimiter),
      this.delimiter
    );
    MethodFailedException.assert(
      this.getComponent(i) == c &&
        newName.getNoComponents() == this.getNoComponents() + 1,
      "insert failed"
    );
    return newName;
  }

  public append(c: string) {
    this.assertIsValidComponent(c);
    this.assertClassInvariants();
    let newComponents = this.splitEscaped(this.delimiter);
    newComponents.push(c);
    let newName = new StringName(
      newComponents.join(this.delimiter),
      this.delimiter
    );
    MethodFailedException.assert(
      newName.getComponent(newName.getNoComponents() - 1) == c,
      "insert failed"
    );
    return newName;
  }

  public remove(i: number) {
    this.assertIsValidIndex(i);
    this.assertClassInvariants();
    let newComponents = this.splitEscaped(this.delimiter);
    newComponents.splice(i, 1);
    let newName = new StringName(
      newComponents.join(this.delimiter),
      this.delimiter
    );
    MethodFailedException.assert(
      newName.getNoComponents() == this.getNoComponents() - 1,
      "insert failed"
    );
    return newName;
  }

  public concat(other: Name) {
    IllegalArgumentException.assert(
      other != null && other != undefined,
      "other cannnot be null or undefined"
    );
    this.assertClassInvariants();
    const prevLength = this.getNoComponents();
    const otherLength = other.getNoComponents();
    if (this.getDelimiterCharacter() != other.getDelimiterCharacter()) {
      throw new IllegalArgumentException(
        "Delimiters have to match for concat to be possible."
      );
    }
    let newComponents = this.splitEscaped(this.delimiter);
    for (let i = 0; i < other.getNoComponents(); i++) {
      newComponents.push(other.getComponent(i));
    }
    let newName = new StringName(
      newComponents.join(this.delimiter),
      this.delimiter
    );
    MethodFailedException.assert(
      newName.getNoComponents() == prevLength + otherLength,
      "concat failed"
    );
    return newName;
  }

  //helper function that split
  private splitEscaped(delimiter: string): string[] {
    const components: string[] = [];
    let current = "";
    let escaped = false;

    for (let i = 0; i < this.name.length; i++) {
      const char = this.name.charAt(i);
      if (escaped) {
        current += char;
        escaped = false;
      } else if (char === ESCAPE_CHARACTER) {
        escaped = true;
        current += char;
      } else if (char === delimiter) {
        components.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    components.push(current);
    return components;
  }

  protected assertMatchesActualLength() {
    let componentCount = 1;
    let escaped = true;
    for (let i = 0; i < this.name.length; i++) {
      if (escaped == false && this.name.charAt(i) == ESCAPE_CHARACTER) {
        escaped = true;
        continue;
      }
      if (escaped == false && this.name.charAt(i) == this.delimiter) {
        componentCount += 1;
        continue;
      }
      escaped = false;
    }
    InvalidStateException.assert(
      this.noComponents == componentCount,
      "string name does not match length"
    );
  }

  protected assertClassInvariants() {
    this.assertIsNotEmptyName();
    this.assertIsValidDelChar(this.delimiter);
    this.assertMatchesActualLength();
  }

  protected assertPostconditionAndDoBackup(
    condition: boolean,
    message: string,
    backup: StringName
  ): void {
    if (!condition) {
      this.name = backup.name;
      this.delimiter = backup.delimiter;
      throw new MethodFailedException(message);
    }
    this.assertClassInvariants();
  }
}
