import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {
  protected name: string = "";
  protected noComponents: number = 0;

  constructor(other: string, delimiter?: string) {
    super();
    if (delimiter) {
      this.assertIsValidDelChar(delimiter);
      this.delimiter = delimiter;
    }
    this.name = other;
    let escaped: boolean = false;
    this.noComponents = 1;
    for (let i = 0; i < other.length; i++) {
      //adds +1 to length if a delimiter is found that is not escaped
      // . -> +1
      // \. -> +0
      // \\. -> +1
      // \\\. -> +0
      // \\\\. -> +1
      if (escaped == false && other.charAt(i) == ESCAPE_CHARACTER) {
        escaped = true;
        continue;
      }
      if (escaped == false && other.charAt(i) == this.delimiter) {
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
    const backup = this.clone() as StringName;
    const components = this.splitEscaped(this.delimiter);
    components[i] = c;
    this.name = components.join(this.delimiter);
    this.assertPostconditionAndDoBackup(
      this.getComponent(i) == c &&
        this.getNoComponents() == backup.getNoComponents() + 1,
      "setComponent failed",
      backup
    );
  }

  public insert(i: number, c: string) {
    this.assertIsValidIndex(i);
    this.assertIsValidComponent(c);
    this.assertClassInvariants();
    const backup = this.clone() as StringName;
    const components = this.splitEscaped(this.delimiter);
    components.splice(i, 0, c);
    this.name = components.join(this.delimiter);
    this.noComponents += 1;
    this.assertPostconditionAndDoBackup(
      this.getComponent(i) == c &&
        this.getNoComponents() == backup.getNoComponents() + 1,
      "insert failed",
      backup
    );
  }

  public append(c: string) {
    this.assertIsValidComponent(c);
    this.assertClassInvariants();
    const backup = this.clone() as StringName;
    const components = this.splitEscaped(this.delimiter);
    components.push(c);
    this.name = components.join(this.delimiter);
    this.noComponents += 1;
    this.assertPostconditionAndDoBackup(
      this.getComponent(this.getNoComponents() - 1) == c &&
        this.getNoComponents() == backup.getNoComponents() + 1,
      "append failed",
      backup
    );
  }

  public remove(i: number) {
    this.assertIsValidIndex(i);
    this.assertClassInvariants();
    const backup = this.clone() as StringName;
    const components = this.splitEscaped(this.delimiter);
    components.splice(i, 1);
    this.name = components.join(this.delimiter);
    this.noComponents -= 1;
    this.assertPostconditionAndDoBackup(
      this.getNoComponents() == backup.getNoComponents() - 1,
      "remove failed",
      backup
    );
  }

  public concat(other: Name): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(other);
    this.assertClassInvariants();
    const backup = this.clone() as StringName;
    const prevLength = this.getNoComponents();
    const otherLength = other.getNoComponents();
    if (this.getDelimiterCharacter() != other.getDelimiterCharacter()) {
      throw new Error("Delimiters have to match for concat to be possible.");
    }
    for (let i = 0; i < other.getNoComponents(); i++) {
      this.append(other.getComponent(i));
    }
    this.assertPostconditionAndDoBackup(
      this.getNoComponents() == prevLength + otherLength,
      "concat failed",
      backup
    );
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
    InvalidStateException.assertCondition(
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
      throw new MethodFailureException(message);
    }
    this.assertClassInvariants();
  }
}
