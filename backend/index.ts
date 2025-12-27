import http from "http";
import app from "./src/app";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  console.error("Server error:", err.message);

  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});
