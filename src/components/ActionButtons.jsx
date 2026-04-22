export default function ActionButtons({ onGenerate, json, hasData, notify, originalFileName }) {
  const hasJson = json && json.length > 0;

  const downloadJSON = () => {
    const agora = new Date();
    const timestamp = agora.toISOString()
      .replace(/[-T:]/g, '')
      .split('.')[0];

    const nomeLimpo = originalFileName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_");

    const nomeFinal = `${nomeLimpo}_${timestamp}.json`;

    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeFinal;
    a.click();
    URL.revokeObjectURL(url);
    notify(`Download concluído: ${nomeFinal}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {!hasJson ? (
        <button 
          onClick={onGenerate}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 px-12 rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-95 flex items-center gap-3 text-lg uppercase tracking-wider"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          GERAR JSON RTA
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 animate-in zoom-in-95 duration-300">
          <button 
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(json, null, 2));
              notify("Copiado com Sucesso!");
            }}
            className="bg-white border-2 border-slate-300 text-slate-700 font-black py-4 px-10 rounded-2xl hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-2 uppercase text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            COPIAR JSON
          </button>
          
          <button 
            onClick={downloadJSON}
            className="bg-slate-900 text-white font-black py-4 px-10 rounded-2xl hover:bg-black transition-all flex items-center gap-2 shadow-xl uppercase text-sm"
          >
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            BAIXAR JSON
          </button>
        </div>
      )}
    </div>
  );
}