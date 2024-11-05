import { App } from "cdktf";
import { loadAppConfig } from "./src/config/app-config";
import { MyStack } from "./src/stack/my-stack";

require("dotenv").config();

const app = new App();
const config = loadAppConfig();

new MyStack(app, "stack", { ordersPath: config.ordersPath });
app.synth();
