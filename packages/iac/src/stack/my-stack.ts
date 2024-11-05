import { TerraformStack } from "cdktf";
import { Construct } from "constructs";
import * as path from "path";
import { Order } from "../../.gen/providers/hashicups/order/";
import { HashicupsProvider } from "../../.gen/providers/hashicups/provider/";
import { loadAppConfig } from "../config/app-config";
import { getSubdirectories, loadItemList } from "../utils/file-utils";

interface MyStackConfig {
  ordersPath: string;
}

export class MyStack extends TerraformStack {
  private readonly config;

  constructor(scope: Construct, id: string, config: MyStackConfig) {
    super(scope, id);

    this.config = loadAppConfig();

    new HashicupsProvider(this, "hashicups", {
      host: this.config.hashicups.host,
      username: this.config.hashicups.username,
      password: this.config.hashicups.password,
    });

    const orderDirectories = getSubdirectories(config.ordersPath);

    for (const folder of orderDirectories) {
      new Order(this, folder, {
        items: loadItemList(path.join(config.ordersPath, folder)),
      });
    }
  }
}
