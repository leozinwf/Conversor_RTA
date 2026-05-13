import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import DataPreview from "./components/DataPreview";
import JsonPreview from "./components/JsonPreview";
import MappingEditor from "./components/MappingEditor";
import { useExcelProcessor } from "./hooks/useExcelProcessor";

export default function App() {
  const {
    data,
    json,
    error,
    fileName,
    loadFile,
    loading,
    mappings,
    setMappings,
    wrapperTemplate,       // ADICIONADO
    setWrapperTemplate,    // ADICIONADO
  } = useExcelProcessor();

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Conversão inteligente de planilhas
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Excel →
            <span className="text-emerald-500"> JSON</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl">
            Transforme planilhas em estruturas JSON prontas para automações,
            integrações e RPA.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <FileUpload onUpload={loadFile} />
          </div>

          {loading && (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
              <p className="mt-6 text-slate-500 font-medium">
                Processando planilha...
              </p>
            </div>
          )}

          {!loading && data.length > 0 && (
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-500">Arquivo</p>
                  <h3 className="text-lg font-bold text-slate-800 mt-2 truncate">
                    {fileName}
                  </h3>
                </div>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-500">Registros</p>
                  <h3 className="text-lg font-bold text-slate-800 mt-2">
                    {data.length}
                  </h3>
                </div>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-500">Status</p>
                  <h3 className="text-lg font-bold text-emerald-600 mt-2">
                    Estrutura válida
                  </h3>
                </div>
              </div>

              {/* MAPEAMENTO ATUALIZADO PASSANDO O TEMPLATE */}
              <MappingEditor
                headers={Object.keys(data[0]?.campos || {})}
                mappings={mappings}
                setMappings={setMappings}
                wrapperTemplate={wrapperTemplate}          
                setWrapperTemplate={setWrapperTemplate}    
                data={data}
              />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <DataPreview data={data} />
                <JsonPreview json={json} />
              </div>
            </div>
          )}

          {error && (
            <div className="m-8 bg-red-50 border border-red-200 rounded-2xl p-5">
              <h3 className="font-bold text-red-600 mb-2">
                Erro ao processar arquivo
              </h3>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}