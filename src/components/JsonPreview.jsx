export default function JsonPreview({ json }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      JSON.stringify(json, null, 2)
    );
  };

  // Verifica se o json tem dados (seja ele um Array ou Objeto)
  const hasData = json && Object.keys(json).length > 0;

  // Tenta descobrir a quantidade de registros para exibir no topo
  const getRecordCount = () => {
    if (!json) return 0;
    if (json.total) return json.total;
    if (Array.isArray(json)) return json.length;
    if (json.error) return "Erro de sintaxe";
    return "Estrutura gerada";
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#020817] h-full flex flex-col">
      <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white">
            Saída JSON (RTA)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {getRecordCount()}
          </p>
        </div>

        <button
          onClick={handleCopy}
          disabled={!hasData || json?.error}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition px-4 py-2 rounded-lg text-sm font-semibold text-white"
        >
          Copiar JSON
        </button>
      </div>

      <div className="overflow-auto p-5 text-sm flex-1">
        <pre className={`whitespace-pre-wrap break-words ${json?.error ? 'text-red-400' : 'text-emerald-300'}`}>
          {hasData
            ? JSON.stringify(json, null, 2)
            : "Aguardando arquivo Excel..."}
        </pre>
      </div>
    </div>
  );
}