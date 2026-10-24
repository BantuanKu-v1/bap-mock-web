import { D1Database } from "@cloudflare/workers-types";

export type AppEnv = {
  Bindings: {
    jkm_mock_db: D1Database;
    API_KEY: string;
    ADMIN_API_KEY: string;
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;
  };
  Variables: {
    clientId: string;
  };
};
