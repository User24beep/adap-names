import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";

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
    // read something
    return new Int8Array();
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
