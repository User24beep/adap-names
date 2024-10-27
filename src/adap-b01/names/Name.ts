export class Name {
  public readonly DEFAULT_DELIMITER: string = ".";
  private readonly ESCAPE_CHARACTER = "\\";

  private components: string[] = [];
  private delimiter: string = this.DEFAULT_DELIMITER;

  /** @methodtype initialization-method */
  constructor(other: string[], delimiter?: string) {
    if (delimiter) {
      this.delimiter = delimiter;
    }
    this.components = [...other];
  }

  /** Returns human-readable representation of Name instance */
  /** @methodtype conversion-method */
  public asNameString(delimiter: string = this.delimiter): string {
    let nameString: string = ""
    for (let i = 0; i < this.components.length; i++) {
      let currentComponent: string = this.components[i]
      for (let j = 0; j < currentComponent.length; j++) {
        //add escape character before delimiter
        if (currentComponent[j] == this.delimiter) {
          nameString += this.ESCAPE_CHARACTER + currentComponent[j]
        }
        //add escape charater befor escape character
        else if (currentComponent[j] == this.ESCAPE_CHARACTER) {
          nameString += this.ESCAPE_CHARACTER + currentComponent[j]
        }
        else {
          nameString += currentComponent[j]
        }
      }
      //adds a delimiter if its not the last component
      if (i < this.components.length - 1) {
        nameString += delimiter
      }
    }
    return nameString
  }

  /** @methodtype get-method */
  public getComponent(i: number): string {
    if (this.components && i >= 0 && i < this.components.length) {
      return this.components[i]
    }
    throw new Error("invalid component");
  }

  /** @methodtype set-method */
  public setComponent(i: number, c: string): void {
    if (i >= 0 && i < this.components.length) {
      this.components[i] = c
      return
    }
    throw new Error("invalid i");
  }

  /** Returns number of components in Name instance */
  /** @methodtype get-method */
  public getNoComponents(): number {
    return this.components.length
  }

  /** @methodtype command-method */
  public insert(i: number, c: string): void {
    if (i >= 0 && i < this.components.length) {
      this.components.splice(i, 0, c)
      return
    }
    throw new Error("invalid i");
  }

  /** @methodtype command-method */
  public append(c: string): void {
    this.components.push(c)
  }

  /** @methodtype command-method */
  public remove(i: number): void {
    if (i >= 0 && i < this.components.length) {
      this.components.splice(i, 1)
      return
    }
    throw new Error("invalid i");
  }
}
