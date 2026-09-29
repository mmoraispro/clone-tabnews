const net = require("node:net");

const port = Number(process.argv[2] || 3000);

const server = net.createServer();

server.once("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `A porta ${port} já está em uso. Encerre o "npm run dev" antes de rodar "npm test".`,
    );

    process.exit(1);
  }

  throw error;
});

server.once("listening", () => {
  server.close(() => {
    process.exit(0);
  });
});

server.listen(port, "127.0.0.1");
