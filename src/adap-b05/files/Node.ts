import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { RootNode } from "./RootNode";

export class Node {
  protected baseName: string = "";
  protected parentNode: Directory;

  constructor(bn: string, pn: Directory) {
    IllegalArgumentException.assertIsNotNullOrUndefined(
      bn,
      "Base name cannot be null or undefined"
    );
    IllegalArgumentException.assertCondition(
      !bn.includes("/"),
      "Base name cannot include /"
    );
    IllegalArgumentException.assertIsNotNullOrUndefined(
      pn,
      "Parent directory cannot be null or undefined"
    );
    this.doSetBaseName(bn);
    this.parentNode = pn; // why oh why do I have to set this
    this.initialize(pn);
  }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

  public getFullName(): Name {
    IllegalArgumentException.assertCondition(
      this.parentNode != null,
      "Parent node cannot be null"
    );
    const result: Name = this.parentNode.getFullName();
    result.append(this.getBaseName());
    return result;
  }

  public getBaseName(): string {
    return this.doGetBaseName();
  }

  protected doGetBaseName(): string {
    return this.baseName;
  }

  public rename(bn: string): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(
      bn,
      "New base name cannot be null or undefined"
    );
    IllegalArgumentException.assertCondition(
      !bn.includes("/"),
      "New base name cannot include /"
    );
    this.doSetBaseName(bn);
  }

  protected doSetBaseName(bn: string): void {
    this.baseName = bn;
  }

  public getParentNode(): Directory {
    return this.parentNode;
  }

  /**
   * Returns all nodes in the tree that match bn
   * @param bn basename of node being searched for
   */
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
    return result;
  }

}
