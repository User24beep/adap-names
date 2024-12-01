import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

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

  public getChildNodes(): Set<Node> {
    return this.childNodes;
  }
}
