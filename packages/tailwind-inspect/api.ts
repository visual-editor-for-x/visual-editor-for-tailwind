import * as fs from "fs";
import type { Handler } from "vite-plugin-mix";
import stringToString from "stream-to-string";

export const handler: Handler = async (req, res, next) => {
  if (req.path === "/edit-target") {
    if (req.method === "GET") {
      const content = fs.readFileSync("edit-target.tsx", "utf-8");
      return res.end(content);
    }
    if (req.method === "PUT") {
      const content = await stringToString(req);
      fs.writeFileSync("edit-target.tsx", content);
      return res.end("OK");
    }
  }
  next();
};
