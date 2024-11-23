import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

  constructor(other: string[], delimiter?: string) {
    if (delimiter) {
      this.delimiter = delimiter;
    }
    this.components = [...other];
  }

  public asString(delimiter: string = this.delimiter): string {
    let nameString: string = "";
    for (let i = 0; i < this.components.length; i++) {
      let currentComponent: string = this.components[i];
      nameString += currentComponent;
      //adds a delimiter if its not the last component
      if (i < this.components.length - 1) {
        nameString += delimiter;
      }
    }
    return nameString;
  }

  public asDataString(): string {
    let nameString: string = "";
    for (let i = 0; i < this.components.length; i++) {
      let currentComponent: string = this.components[i];
      for (let j = 0; j < currentComponent.length; j++) {
        //add escape character before delimiter
        if (currentComponent[j] == this.delimiter) {
          nameString += ESCAPE_CHARACTER + currentComponent[j];
        }
        //add escape charater before escape character
        else if (currentComponent[j] == ESCAPE_CHARACTER) {
          nameString += ESCAPE_CHARACTER + currentComponent[j];
        } else {
          nameString += currentComponent[j];
        }
      }
      //adds a delimiter if its not the last component
      if (i < this.components.length - 1) {
        nameString += this.delimiter;
      }
    }
    return nameString;
  }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation");
    }

    public isEmpty(): boolean {
        throw new Error("needs implementation");
    }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    if (i < 0 || i >= this.components.length) {
      throw new Error("invalid component");
    }
    return this.components[i];
  }

  public setComponent(i: number, c: string): void {
    if (i < 0 || i >= this.components.length) {
      throw new Error("invalid component");
    }
    this.components[i] = c;
  }

  public insert(i: number, c: string): void {
    if (i < 0 || i > this.components.length) {
      throw new Error("invalid component");
    }
    this.components.splice(i, 0, c);
  }

  public append(c: string): void {
    this.components.push(c);
  }

  public remove(i: number): void {
    if (i < 0 || i >= this.components.length) {
      throw new Error("invalid component");
    }
    this.components.splice(i, 1);
  }

  public concat(other: Name): void {
    if (this.delimiter != other.getDelimiterCharacter()) {
      throw new Error("delimiters do not match");
    }
    for (let i = 0; i < other.getNoComponents(); i++) {
      this.append(other.getComponent(i));
    }
  }
}
