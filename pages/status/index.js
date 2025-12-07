import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());
const LOADING = "Carregando...";

export default function StatusPage() {
  const { data, error, isLoading } = useSWR("/api/v1/status", fetcher, {
    refreshInterval: 10_000,
  });

  if (error) return <p>Erro ao carregar status</p>;

  return (
    <>
      <UpDateAt data={data} isLoading={isLoading} />
      <DatabaseStatus data={data} isLoading={isLoading} />
    </>
  );
}

function UpDateAt({ data, isLoading }) {
  const updateAtText =
    isLoading || !data?.update_at
      ? LOADING
      : new Date(data.update_at).toLocaleString("pt-BR");

  return (
    <>
      <h1>Status</h1>
      <div>
        <b>Última atualização:</b> {updateAtText}
      </div>
    </>
  );
}

function DatabaseStatus({ data, isLoading }) {
  const db = data?.dependencies?.database;

  const status = isLoading
    ? {
        databaseVersion: LOADING,
        maxConnections: LOADING,
        openedConnections: LOADING,
      }
    : {
        databaseVersion: db?.version ?? LOADING,
        maxConnections: db?.max_connections ?? LOADING,
        openedConnections: db?.opened_connections ?? LOADING,
      };

  return (
    <>
      <h2>Database</h2>
      <div>
        <b>Versão:</b> {status.databaseVersion}
      </div>
      <div>
        <b>Conexões abertas:</b> {status.openedConnections}
      </div>
      <div>
        <b>Conexões máximas:</b> {status.maxConnections}
      </div>
    </>
  );
}
