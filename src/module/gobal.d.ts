import { HelloWorld } from "./apps/HelloWorld";

declare global {
    interface Window {
        HelloWorld: typeof HelloWorld;
    }
}
