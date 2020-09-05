import express from "express";
import { createServer } from "http";
import { AddressInfo } from "net";
import { resolve } from "path";

const app = express();
const server = createServer(app);

app.use(express.static("./dist"));

app.use((req, res, next) => {
  res.sendFile(resolve(__dirname, "../../../../dist/index.html"));
});

export function startServer() {
  server.listen({ port: process.env.PORT || 9000, address: "0.0.0.0" }, () => {
    const address = server.address() as AddressInfo;
    console.log(`🚀 Listening on http://${address.address}:${address.port}`);
  });
}
