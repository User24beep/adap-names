import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  protected name: string = "";
  protected length: number = 0;

  constructor(other: string, delimiter?: string) {
    if (delimiter) {
      this.delimiter = delimiter;
    }
    this.name = other;
    let escaped: boolean = false;
    this.length = 1;
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
        this.length += 1;
        continue;
      }
      escaped = false;
    }
  }

  public asString(delimiter: string = this.delimiter): string {
    let nameString = "";
    //remove escape characters from string
    let escaped: boolean = false;
    for (let i = 0; i < this.name.length; i++) {
      if (escaped) {
        //should be either delimiter or escape character
        nameString += this.name.charAt(i);
        escaped = false;
      } else {
        //Found delimiter that is not escaped
        if (this.name.charAt(i) == this.delimiter) {
          nameString += delimiter;
          //Found escape character that is not escaped
        } else if (this.name.charAt(i) == ESCAPE_CHARACTER) {
          escaped = true;
        } else {
          nameString += this.name.charAt(i);
        }
      }
    }
    if (escaped) {
      nameString += ESCAPE_CHARACTER;
    }
    return nameString;
  }

  public asDataString(): string {
    return this.name;
  }

  public isEmpty(): boolean {
    return this.length == 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  public getNoComponents(): number {
    return this.length;
  }

  public getComponent(x: number): string {
    const components = this.name.split(this.delimiter);
    if (x < 0 || x >= components.length) {
      throw new Error("Invalid x");
    }
    return components[x];
  }

  public setComponent(n: number, c: string): void {
    const components = this.name.split(this.delimiter);
    if (n < 0 || n >= components.length) {
      throw new Error("Invalid n");
    }
    components[n] = c;
    this.name = components.join(this.delimiter);
  }

  public insert(n: number, c: string): void {
    const components = this.name.split(this.delimiter);
    if (n < 0 || n > components.length) {
      throw new Error("Invalid n");
    }
    components.splice(n, 0, c);
    this.name = components.join(this.delimiter);
    this.length += 1;
  }

  public append(c: string): void {
    if (this.length > 0) {
      this.name += this.delimiter;
    }
    this.name += c;
    this.length += 1;
  }

  public remove(n: number): void {
    const components = this.name.split(this.delimiter);
    if (n < 0 || n >= components.length) {
      throw new Error("Invalid n");
    }
    components.splice(n, 1);
    this.name = components.join(this.delimiter);
    this.length -= 1;
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
