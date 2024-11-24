import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        IllegalArgumentException.assertIsNotNullOrUndefined(RootNode)
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    //hier braucht man glaube ich keine preconditions weil es beides null operations sind
    public move(to: Directory): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(to, "Target directory cannot be null or undefined");
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }

}