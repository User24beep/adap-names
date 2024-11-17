import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {
  protected name: string = "";
  protected length: number = 0;

  constructor(other: string, delimiter?: string) {
    super();
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

  getNoComponents(): number {
    return this.length;
  }

  getComponent(i: number): string {
    const components = this.splitEscaped(this.delimiter);
    if (i < 0 || i >= components.length) {
      throw new Error("Invalid i");
    }
    return components[i];
  }

  setComponent(i: number, c: string) {
    const components = this.splitEscaped(this.delimiter);
    if (i < 0 || i >= components.length) {
      throw new Error("Invalid i");
    }
    components[i] = c;
    this.name = components.join(this.delimiter);
  }

  insert(i: number, c: string) {
    const components = this.splitEscaped(this.delimiter);
    if (i < 0 || i > components.length) {
      throw new Error("Invalid i");
    }
    components.splice(i, 0, c);
    this.name = components.join(this.delimiter);
    this.length += 1;
  }

  append(c: string) {
    const components = this.splitEscaped(this.delimiter);
    components.push(c);
    this.name = components.join(this.delimiter);
    this.length += 1;
  }

  remove(i: number) {
    const components = this.splitEscaped(this.delimiter);
    if (i < 0 || i >= components.length) {
      throw new Error("Invalid i");
    }
    components.splice(i, 1);
    this.name = components.join(this.delimiter);
    this.length -= 1;
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
}
