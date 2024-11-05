export function loadAppConfig() {
  return {
    ordersPath: process.env.ORDERS_PATH || "./orders",
    hashicups: {
      host: process.env.HASHICUPS_HOST || "http://127.0.0.1:9090",
      username: process.env.HASHICUPS_USERNAME || "education",
      password: process.env.HASHICUPS_PASSWORD || "test123",
    },
  };
}
