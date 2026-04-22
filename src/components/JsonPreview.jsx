// src/components/JsonPreview.jsx
export default function JsonPreview({ json }) {
  const hasJson = json && json.length > 0;

  return (
    <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden flex flex-col h-[500px]">
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <h2 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          Saída JSON (RTA)
        </h2>
      </div>
      <div className="p-4 flex-grow overflow-auto bg-slate-900/50">
        {hasJson ? (
          <pre className="text-xs text-emerald-400 font-mono selection:bg-emerald-500/30">{JSON.stringify(json, null, 2)}</pre>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600">
            <p className="text-sm">Aguardando geração do JSON...</p>
          </div>
        )}
      </div>
    </div>
  );
}