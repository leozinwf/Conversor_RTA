export default function JsonPreview({ json }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      JSON.stringify(json, null, 2)
    );
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#020817] h-full flex flex-col">
      <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white">
            Saída JSON (RTA)
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            {json?.length || 0} registros convertidos
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="bg-emerald-500 hover:bg-emerald-400 transition px-4 py-2 rounded-lg text-sm font-semibold text-white"
        >
          Copiar JSON
        </button>
      </div>

      <div className="overflow-auto p-5 text-sm flex-1">
        <pre className="text-emerald-300 whitespace-pre-wrap break-words">
          {json?.length
            ? JSON.stringify(json, null, 2)
            : "Aguardando arquivo Excel..."}
        </pre>
      </div>
    </div>
  );
}