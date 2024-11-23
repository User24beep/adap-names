import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

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
    //easier to edit in-place in this case
    let nameString: string = this.name;
    let escaped: boolean = false;
    //loops over name and removes Escape character if possible
    for (let i = 0; i < this.name.length; i++) {
      if (this.name[i] == ESCAPE_CHARACTER) {
        escaped = !escaped;
      } else {
        if (this.name[i] === this.getDelimiterCharacter()) {
          if (!escaped) {
            //found real delimiter
            nameString =
              nameString.slice(0, i) + delimiter + nameString.slice(i + 1);
          }
        }
        escaped = false;
      }
    }
    return nameString;
  }

  public asDataString(): string {
    let dataString = "";
    //ads ESCAPE_CHARACTER bevore other ESCAPE_CHARACTERs
    for (let i = 0; i < this.name.length; i++) {
      if (
        this.name.charAt(i) === ESCAPE_CHARACTER &&
        i < this.name.length - 1 &&
        this.name.charAt(i + 1) != this.delimiter
      ) {
        dataString += ESCAPE_CHARACTER;
      }
      dataString += this.name.charAt(i);
    }
    return dataString;
  }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation");
    }

    public isEmpty(): boolean {
        throw new Error("needs implementation");
    }

  public getNoComponents(): number {
    return this.length;
  }

  public getComponent(x: number): string {
    const components = this.splitEscaped(this.delimiter);
    if (x < 0 || x >= components.length) {
      throw new Error("Invalid x");
    }
    return components[x];
  }

  public setComponent(n: number, c: string): void {
    const components = this.splitEscaped(this.delimiter);
    if (n < 0 || n >= components.length) {
      throw new Error("Invalid n");
    }
    components[n] = c;
    this.name = components.join(this.delimiter);
  }

  public insert(n: number, c: string): void {
    const components = this.splitEscaped(this.delimiter);
    if (n < 0 || n > components.length) {
      throw new Error("Invalid n");
    }
    components.splice(n, 0, c);
    this.name = components.join(this.delimiter);
    this.length += 1;
  }

  public append(c: string): void {
    const components = this.splitEscaped(this.delimiter);
    components.push(c);
    this.name = components.join(this.delimiter);
    this.length += 1;
  }

  public remove(n: number): void {
    const components = this.splitEscaped(this.delimiter);
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
}
