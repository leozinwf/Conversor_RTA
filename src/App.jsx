import { useState } from "react";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import DataPreview from "./components/DataPreview";
import JsonPreview from "./components/JsonPreview";
import ActionButtons from "./components/ActionButtons";
import { useExcelProcessor } from "./hooks/useExcelProcessor";

export default function App() {
  const { data, json, error, fileName, loadFile, generateJson } = useExcelProcessor();
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-12 font-sans text-slate-900">
      <Header />

      {/* Alertas de tela integrados */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 animate-in fade-in slide-in-from-right-4">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="font-bold">{notification}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6">
        <div className="space-y-8">
          
          {/* PASSO 1: UPLOAD */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-emerald-200">1</span>
              <div>
                <h2 className="text-xl font-black text-slate-800">CARREGAR PLANILHA</h2>
                <p className="text-sm text-slate-500">Selecione o arquivo Excel extraído do sistema.</p>
              </div>
            </div>
            <FileUpload onUpload={loadFile} />
          </section>

          {/* FLUXO DE TRABALHO (Só aparece após o upload) */}
          {data.length > 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              
              {/* PASSO 2: VISUALIZAÇÃO E CONVERSÃO */}
              <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-4 mb-8">
                  <span className="bg-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-emerald-200">2</span>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">REVISÃO E CONVERSÃO</h2>
                    <p className="text-sm text-slate-500">Verifique os dados antes de gerar o JSON de automação.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600">Planilha Excel</h3>
                      <span className="text-[10px] text-slate-400 font-mono italic">Arraste para o lado para ver colunas ➔</span>
                    </div>
                    <DataPreview data={data} />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Saída Estruturada</h3>
                    <JsonPreview json={json} />
                  </div>
                </div>

                {/* PASSO 3: AÇÕES FINAIS */}
                <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col items-center">
                  <div className="bg-slate-50 rounded-2xl p-8 w-full max-w-2xl text-center border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Tudo pronto para os robôs?</h3>
                    <ActionButtons 
                      onGenerate={generateJson} 
                      json={json} 
                      hasData={data.length > 0} 
                      notify={showNotification}
                      originalFileName={fileName}
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}