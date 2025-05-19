import { id, init, tx } from "@instantdb/react";
import schema from "../instant.schema";

export const isDev = import.meta.env.DEV;
export const isBrowser = typeof window != "undefined";

// ID for app: Notizen
export const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;
export const database_mode = import.meta.env.VITE_INSTANT_MODE ?? "local";

if (!APP_ID) {
  throw new Error("APP_ID is not set");
}

// which instantdb mode are we in?
const client_db_config =
  database_mode === "local"
    ? {
        appId: APP_ID,
        // use local instantdb server layer
        apiURI: "http://localhost:8888",
        websocketURI: "ws://localhost:8888/runtime/session",
        devtool: false,
        schema: schema,
      }
    : {
        appId: APP_ID,
        devtool: false,
        schema: schema,
      };

console.log("client_db_config", client_db_config);

export const db = init(client_db_config);

export { id, tx };
