import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
  OPEN,
  CLOSED,
  DELETED,
}

export class File extends Node {
  protected state: FileState = FileState.CLOSED;

  constructor(baseName: string, parent: Directory) {
    IllegalArgumentException.assertIsNotNullOrUndefined(baseName);
    IllegalArgumentException.assertIsNotNullOrUndefined(parent);
    super(baseName, parent);
  }

  public open(): void {
    IllegalArgumentException.assertCondition(
      this.doGetFileState() == FileState.CLOSED,
      "File State has to be CLOSED to run open()"
    );
    // do something
  }

  public read(noBytes: number): Int8Array {
    IllegalArgumentException.assertCondition(
      noBytes >= 0,
      "can only read positive number of bytes"
    );
    let result: Int8Array = new Int8Array(noBytes);
    // do something

    let tries: number = 0;
    for (let i: number = 0; i < noBytes; i++) {
      try {
        result[i] = this.readNextByte();
      } catch (ex) {
        tries++;
        if (ex instanceof MethodFailedException) {
          // Oh no! What @todo?!
        }
      }
    }

    return result;
  }

  protected readNextByte(): number {
    return 0; // @todo
  }

  public close(): void {
    IllegalArgumentException.assertCondition(
      this.doGetFileState() == FileState.OPEN,
      "File State has to be OPEN to run close()"
    );
    // do something
  }

  protected doGetFileState(): FileState {
    return this.state;
  }
}
