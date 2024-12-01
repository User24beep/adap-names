import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Link extends Node {
  protected targetNode: Node | null = null;

  constructor(bn: string, pn: Directory, tn?: Node) {
    IllegalArgumentException.assertIsNotNullOrUndefined(
      bn,
      "Base name cannot be null or undefined"
    );
    IllegalArgumentException.assertCondition(
      bn.trim() !== "",
      "Base name cannot be empty"
    );
    IllegalArgumentException.assertCondition(
      !bn.includes("/"),
      "Base name cannot include /"
    );
    IllegalArgumentException.assertIsNotNullOrUndefined(
      pn,
      "Parent directory cannot be null or undefined"
    );

    super(bn, pn);

    if (tn != undefined) {
      this.targetNode = tn;
    }
  }

  public getTargetNode(): Node | null {
    IllegalArgumentException.assertCondition(
      this.targetNode !== null,
      "Target node is null"
    );
    return this.targetNode;
  }

  public setTargetNode(target: Node): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(
      target,
      "Target node cannot be null or undefined"
    );
    this.targetNode = target;
  }

  public getBaseName(): string {
    const target = this.ensureTargetNode(this.targetNode);
    return target.getBaseName();
  }

  public rename(bn: string): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(
      bn,
      "New base name cannot be null or undefined"
    );
    IllegalArgumentException.assertCondition(
      bn.trim() !== "",
      "New base name cannot be empty"
    );
    IllegalArgumentException.assertCondition(
      !bn.includes("/"),
      "New base name cannot include /"
    );

    const target = this.ensureTargetNode(this.targetNode);
    target.rename(bn);
  }

  protected ensureTargetNode(target: Node | null): Node {
    IllegalArgumentException.assertCondition(
      target !== null,
      "Target node is null"
    );
    const result: Node = this.targetNode as Node;
    return result;
  }
}
