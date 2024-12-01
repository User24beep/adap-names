import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Node {
  protected baseName: string = "";
  protected parentNode: Directory;

  constructor(bn: string, pn: Directory) {
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

    this.doSetBaseName(bn);
    this.parentNode = pn; // why oh why do I have to set this
    this.initialize(pn);
  }

  protected initialize(pn: Directory): void {
    this.parentNode = pn;
    this.parentNode.add(this);
  }

  public move(to: Directory): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(
      to,
      "Target directory cannot be null or undefined"
    );
    IllegalArgumentException.assertCondition(
      to !== this.parentNode,
      "Cannot move to same directory"
    );

    this.parentNode.remove(this);
    to.add(this);
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
      bn.trim() !== "",
      "New base name cannot be empty"
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
}
