const { spawn } = require("child_process");

// Inicializa a flag de desligamento
let shuttingDown = false;

// Inicia o processo principal de desenvolvimento.
const dev = spawn("npm", ["run", "dev:run"], { stdio: "inherit", shell: true });

// Lida com o sinal SIGINT (Ctrl+C) para desligamento.
process.on("SIGINT", () => {
  if (shuttingDown) {
    console.warn(
      "\n🔴 SIGINT recebido novamente durante o desligamento. Forçando saída.",
    );
    process.exit(1);
  }
  shuttingDown = true; // Ativa a flag de desligamento.

  console.log("\n🔴 SIGINT recebido. Parando serviços...");

  dev.kill("SIGTERM");

  const stopProcess = spawn("npm", ["run", "services:stop"], {
    stdio: "inherit",
    shell: true,
  });

  stopProcess.on("close", (code) => {
    console.log(`    → Exit code: ${code}`);
    process.exit(code ?? 0);
  });
});

// Lida com o evento 'exit' do processo filho 'dev'.
dev.on("exit", (code) => {
  if (!shuttingDown) {
    console.error(`Processo dev encerrou inesperadamente com código ${code}.`);
    process.exit(code ?? 1);
  }
});
