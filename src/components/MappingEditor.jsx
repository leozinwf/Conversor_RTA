import { useRef, useState } from "react";

export default function MappingEditor({
  headers,
  mappings,
  setMappings,
  wrapperTemplate,
  setWrapperTemplate,
}) {
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const updateMapping = (excelField, jsonField) => {
    setMappings((prev) => ({
      ...prev,
      [excelField]: jsonField.trim(),
    }));
  };

  const exportMappings = () => {
    const configuracaoCompleta = { mappings, wrapperTemplate };
    const blob = new Blob([JSON.stringify(configuracaoCompleta, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "configuracao_rta.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Configuração exportada com sucesso!", "success");
  };

  const importMappings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.mappings && imported.wrapperTemplate) {
          setMappings(imported.mappings);
          setWrapperTemplate(imported.wrapperTemplate);
        } else {
          setMappings(imported);
        }
        showToast("Estrutura importada com sucesso!", "success");
      } catch {
        showToast("Arquivo inválido ou corrompido.", "error");
      }
    };
    reader.readAsText(file);
    event.target.value = null; 
  };

  const formatTemplate = () => {
    try {
      const parsed = JSON.parse(wrapperTemplate);
      setWrapperTemplate(JSON.stringify(parsed, null, 2));
      showToast("JSON formatado com sucesso!", "success");
    } catch (e) {
      try {
        let autoFixedJSON = wrapperTemplate
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/'/g, '"');

        const parsedFixed = JSON.parse(autoFixedJSON);
        setWrapperTemplate(JSON.stringify(parsedFixed, null, 2));
        showToast("Erros de sintaxe corrigidos e JSON formatado automaticamente!", "success");
      } catch (err) {
        showToast("Estrutura muito danificada. Use os 'Modelos Prontos' acima da caixa de texto.", "error");
      }
    }
  };

  // NOVO: Função para resetar o template para o padrão inicial
  const resetTemplate = () => {
    setWrapperTemplate('[\n  {\n    "items": "{{items}}",\n    "total": "{{total}}"\n  }\n]');
    showToast("Estrutura resetada para o padrão!", "success");
  };

  const templatesProntos = [
    {
      nome: "Lista Padrão",
      descricao: "Apenas um array de dados",
      valor: '[\n  {\n    "items": "{{items}}"\n  }\n]'
    },
    {
      nome: "Lista + Total",
      descricao: "Itens e quantidade",
      valor: '[\n  {\n    "items": "{{items}}",\n    "total": "{{total}}"\n  }\n]'
    },
    {
      nome: "Objeto (Dados)",
      descricao: "Dentro de um objeto 'dados'",
      valor: '{\n  "dados": "{{items}}"\n}'
    },
    {
      nome: "Paginação API",
      descricao: "Formato padrão de APIs",
      valor: '{\n  "status": "success",\n  "total_registros": "{{total}}",\n  "data": "{{items}}"\n}'
    }
  ];

  const aplicarTemplate = (valor) => {
    setWrapperTemplate(valor);
    showToast("Modelo aplicado! Edite os nomes se necessário.", "success");
  };

  const usedFields = Object.entries(mappings)
    .filter(([_, value]) => value?.trim())
    .map(([_, value]) => value.trim());

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
      
      {toast && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all z-10 flex items-center gap-2
          ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}
        `}>
          {toast.type === 'success' ? (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pt-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Estrutura e Mapeamento
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Defina o esqueleto final e mapeie as colunas (use pontos para estruturas aninhadas, ex: <b>cliente.nome</b>).
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            Importar
          </button>

          <button
            onClick={exportMappings}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            Exportar
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={importMappings}
          />
        </div>
      </div>

      {/* TEMPLATE DA ESTRUTURA RAIZ */}
      <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              Estrutura Raiz do JSON
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Escolha um modelo abaixo ou digite manualmente.
            </p>
          </div>
          
          <div className="flex gap-2">
            {/* NOVO BOTÃO: RESETAR */}
            <button
              onClick={resetTemplate}
              className="text-xs bg-white border border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 px-3 py-2 rounded-lg font-semibold transition shadow-sm flex items-center gap-1.5"
              title="Voltar para a estrutura original"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Resetar
            </button>

            <button
              onClick={formatTemplate}
              className="text-xs bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-lg font-semibold transition shadow-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              Validar e Formatar
            </button>
          </div>
        </div>

        {/* BOTOES DE TEMPLATE RÁPIDO */}
        <div className="flex flex-wrap gap-2 mb-3">
          {templatesProntos.map((tpl, index) => (
            <button
              key={index}
              onClick={() => aplicarTemplate(tpl.valor)}
              title={tpl.descricao}
              className="text-xs px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-md font-medium transition border border-emerald-200"
            >
              + {tpl.nome}
            </button>
          ))}
        </div>

        <textarea
          value={wrapperTemplate}
          onChange={(e) => setWrapperTemplate(e.target.value)}
          spellCheck="false"
          placeholder='Ex: { "dados": "{{items}}" }'
          className="w-full h-44 p-4 border border-slate-300 rounded-xl font-mono text-sm bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition resize-y"
        />
      </div>

      {/* TABELA DE MAPEAMENTO */}
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="grid grid-cols-2 bg-emerald-500 text-white font-semibold">
          <div className="px-5 py-4 text-sm uppercase tracking-wider">Campo Excel</div>
          <div className="px-5 py-4 text-sm uppercase tracking-wider">Caminho no JSON</div>
        </div>

        <div className="divide-y divide-slate-200">
          {headers.map((header) => {
            const currentValue = mappings?.[header] || "";
            const isDuplicate =
              currentValue &&
              usedFields.filter((field) => field === currentValue).length > 1;

            return (
              <div
                key={header}
                className="grid grid-cols-2 items-center bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="px-5 py-4 text-slate-700 truncate font-medium">{header}</div>

                <div className="px-5 py-3">
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => updateMapping(header, e.target.value)}
                    placeholder="ex: dados.valor"
                    className={`w-full border rounded-lg px-4 py-2 outline-none transition text-sm
                      ${
                        isDuplicate
                          ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      }
                    `}
                  />

                  {isDuplicate && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      Caminho duplicado
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-400 flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Campos vazios serão mantidos com o nome original do Excel.
      </div>
    </div>
  );
}