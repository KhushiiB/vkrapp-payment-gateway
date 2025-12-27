"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./src/app"));
const PORT = process.env.PORT || 4000;
const server = http_1.default.createServer(app_1.default);
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
server.on("error", (err) => {
    console.error("Server error:", err.message);
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    }
});
