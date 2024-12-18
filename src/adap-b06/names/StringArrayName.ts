import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(source: string[], delimiter?: string) {
    super();
    if (delimiter) {
      this.assertIsValidDelChar(delimiter);
      this.delimiter = delimiter;
    }
    this.components = [...source];
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
    let newComponents = [...this.components];
    newComponents[i] = c;
    let newName = new StringArrayName(newComponents, this.delimiter);
    MethodFailedException.assert(
      newName.getComponent(i) == c,
      "setComponent failed"
    );
    this.assertClassInvariants();
    return newName;
  }

  public insert(i: number, c: string) {
    this.assertIsValidInsertIndex(i);
    this.assertIsValidComponent(c);
    let newComponents = [...this.components];
    newComponents.splice(i, 0, c);
    let newName = new StringArrayName(newComponents, this.delimiter);
    MethodFailedException.assert(newName.getComponent(i) == c, "insert failed");
    this.assertClassInvariants();
    return newName;
  }

  public append(c: string) {
    this.assertIsValidComponent(c);
    let newComponents = [...this.components];
    newComponents.push(c);
    let newName = new StringArrayName(newComponents, this.delimiter);
    MethodFailedException.assert(
      newName.getComponent(newName.getNoComponents() - 1) === c,
      "append failed"
    );
    this.assertClassInvariants();
    return newName;
  }

  public remove(i: number) {
    this.assertIsValidIndex(i);
    let newComponents = [...this.components];
    newComponents.splice(i, 1);
    let newName = new StringArrayName(newComponents, this.delimiter);
    MethodFailedException.assert(
      newName.getNoComponents() == this.getNoComponents() - 1,
      "remove failed"
    );
    this.assertClassInvariants();
    return newName;
  }

  public concat(other: Name) {
    IllegalArgumentException.assert(
      other != null && other != undefined,
      "other cannot be null or undefined"
    );
    const prevLength = this.getNoComponents();
    const otherLength = other.getNoComponents();
    if (this.getDelimiterCharacter() != other.getDelimiterCharacter()) {
      throw new IllegalArgumentException(
        "Delimiters have to match for concat to be possible."
      );
    }
    let newComponents = [...this.components];
    for (let i = 0; i < other.getNoComponents(); i++) {
      newComponents.push(other.getComponent(i));
    }
    let newName = new StringArrayName(newComponents, this.delimiter);
    MethodFailedException.assert(
      newName.getNoComponents() == prevLength + otherLength,
      "concat failed"
    );
    this.assertClassInvariants();
    return newName;
  }
}
