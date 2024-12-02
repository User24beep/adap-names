import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { InvalidStateException } from "../common/InvalidStateException";

export class Directory extends Node {
  protected childNodes: Set<Node> = new Set<Node>();

  constructor(bn: string, pn: Directory) {
    IllegalArgumentException.assertIsNotNullOrUndefined(bn);
    IllegalArgumentException.assertIsNotNullOrUndefined(pn);
    super(bn, pn);
  }

  public add(cn: Node): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(cn);
    this.childNodes.add(cn);
  }

  public remove(cn: Node): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(cn);
    this.childNodes.delete(cn); // Yikes! Should have been called remove
  }

  public findNodes(bn: string): Set<Node> {
    let result = new Set<Node>();
    const baseName = this.getBaseName();
    if (baseName.length == 0) {
      throw new ServiceFailureException(
        "base name can not be empty",
        new InvalidStateException("base name can not be empty")
      );
    }
    if (baseName === bn) {
      result.add(this);
    }

    for (const child of this.childNodes) {
      let childSet = child.findNodes(bn);
      childSet.forEach(result.add, result);
    }

    return result;
  }
}
