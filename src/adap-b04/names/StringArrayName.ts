import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(other: string[], delimiter?: string) {
    super();
    for (let i = 0; i < other.length; i++) {
      this.assertIsValidComponent(other[i]);
    }
    if (delimiter) {
      this.assertIsValidDelChar(delimiter);
      this.delimiter = delimiter;
    }
    this.components = [...other];
    this.assertClassInvariants();
  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    this.assertIsValidIndex(i);
    this.assertClassInvariants();
    return this.components[i];
  }

  public setComponent(i: number, c: string) {
    this.assertIsValidIndex(i);
    this.assertIsValidComponent(c);
    this.assertClassInvariants();
    const backup = this.clone() as StringArrayName;
    this.components[i] = c;
    this.assertPostconditionAndDoBackup(
      this.components[i] == c &&
        this.getNoComponents() == backup.getNoComponents() + 1,
      "setComponent failed",
      backup
    );
  }

  public insert(i: number, c: string) {
    this.assertIsValidInsertIndex(i);
    this.assertIsValidComponent(c);
    this.assertClassInvariants();
    const backup = this.clone() as StringArrayName;
    this.components.splice(i, 0, c);
    this.assertPostconditionAndDoBackup(
      this.components[i] == c &&
        this.getNoComponents() == backup.getNoComponents() + 1,
      "insert failed",
      backup
    );
  }

  public append(c: string) {
    this.assertIsValidComponent(c);
    this.assertClassInvariants();
    const backup = this.clone() as StringArrayName;
    this.components.push(c);
    this.assertPostconditionAndDoBackup(
      this.components[this.getNoComponents() - 1] == c &&
        this.getNoComponents() == backup.getNoComponents() + 1,
      "append failed",
      backup
    );
  }

  public remove(i: number) {
    this.assertIsValidIndex(i);
    this.assertClassInvariants();
    const backup = this.clone() as StringArrayName;
    this.components.splice(i, 1);
    this.assertPostconditionAndDoBackup(
      this.getNoComponents() == backup.getNoComponents() - 1,
      "remove failed",
      backup
    );
  }

  public concat(other: Name): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(other);
    this.assertClassInvariants();
    const backup = this.clone() as StringArrayName;
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

  protected assertPostconditionAndDoBackup(
    condition: boolean,
    message: string,
    backup: StringArrayName
  ): void {
    if (!condition) {
      this.components = [...backup.components];
      this.delimiter = backup.delimiter;
      throw new MethodFailureException(message);
    }
    this.assertClassInvariants();
  }
}
