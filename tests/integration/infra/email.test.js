import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "TestesEmail <teste@teste.com.br>",
      to: "contato@teste.com.br",
      subject: "Teste de assunto",
      text: "Teste de corpo.",
    });

    await email.send({
      from: "TestesEmail <teste@teste.com.br>",
      to: "contato@teste.com.br",
      subject: "Último e-mail enviado",
      text: "Corpo do último e-mail.",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<teste@teste.com.br>");
    expect(lastEmail.recipients[0]).toBe("<contato@teste.com.br>");
    expect(lastEmail.subject).toBe("Último e-mail enviado");
    expect(lastEmail.text).toBe("Corpo do último e-mail.\r\n");
  });
});
