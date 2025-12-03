import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpDateAt />
    </>
  );
}

function UpDateAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 100000,
  });

  let UpDateAtText = "Carregando...";
  let databaseVersion = "Carregando...";
  let maxConnections = "Carregando...";
  let openedConnections = "Carregando...";

  if (!isLoading && data) {
    UpDateAtText = new Date(data.update_at).toLocaleString("pt-BR");
    databaseVersion = data.dependencies.database.version;
    maxConnections = data.dependencies.database.max_connections;
    openedConnections = data.dependencies.database.opened_connections;
  }

  console.log(data);

  return (
    <>
      <ul>
        <li>
          <b>Última atualização:</b> {UpDateAtText}
        </li>
        <li>
          <b>Database:</b>
        </li>
        <ul>
          <li>
            <b>Version:</b> {databaseVersion}
          </li>
          <li>
            <b>Max Connections:</b> {maxConnections}
          </li>
          <li>
            <b>Opened Connections:</b> {openedConnections}
          </li>
        </ul>
      </ul>
    </>
  );
}
