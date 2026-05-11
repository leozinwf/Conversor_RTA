import { useRef } from "react";

export default function MappingEditor({
  headers,
  mappings,
  setMappings,
}) {

  const fileInputRef = useRef(null);

  // Atualiza mapping
  const updateMapping = (excelField, jsonField) => {

    setMappings((prev) => ({

      ...prev,

      [excelField]: jsonField.trim(),

    }));
  };

  // EXPORTAR
  const exportMappings = () => {

    const blob = new Blob(
      [JSON.stringify(mappings, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "mapeamentos.json";

    a.click();

    URL.revokeObjectURL(url);
  };

  // IMPORTAR
  const importMappings = (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {

      try {

        const imported = JSON.parse(e.target.result);

        setMappings(imported);

      } catch {

        alert("Arquivo inválido.");

      }
    };

    reader.readAsText(file);
  };

  // Campos usados
  const usedFields = Object.entries(mappings)
    .filter(([_, value]) => value?.trim())
    .map(([_, value]) => value.trim());

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h2 className="text-lg font-bold text-slate-800">
            Mapeamento de Campos
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Defina como os campos do Excel serão convertidos no JSON.
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={exportMappings}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            Exportar
          </button>

          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            Importar
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

      {/* TABELA */}
      <div className="overflow-hidden rounded-2xl border border-slate-200">

        {/* HEADER */}
        <div className="grid grid-cols-2 bg-emerald-500 text-white font-semibold">

          <div className="px-5 py-4">
            Campo Excel
          </div>

          <div className="px-5 py-4">
            Campo JSON
          </div>

        </div>

        {/* LINHAS */}
        <div className="divide-y divide-slate-200">

          {headers.map((header) => {

            const currentValue =
              mappings?.[header] || "";

            const isDuplicate =
              currentValue &&
              usedFields.filter(
                (field) => field === currentValue
              ).length > 1;

            return (
              <div
                key={header}
                className="grid grid-cols-2 items-center bg-white hover:bg-slate-50"
              >

                {/* EXCEL */}
                <div className="px-5 py-4 text-slate-700 truncate">
                  {header}
                </div>

                {/* INPUT */}
                <div className="px-5 py-3">

                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) =>
                      updateMapping(header, e.target.value)
                    }
                    placeholder="Digite o nome do campo"
                    className={`w-full border rounded-lg px-4 py-2 transition
                      ${
                        isDuplicate
                          ? "border-red-400 bg-red-50"
                          : "border-slate-300"
                      }
                    `}
                  />

                  {isDuplicate && (

                    <p className="text-xs text-red-500 mt-1">
                      Campo duplicado
                    </p>

                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-4 text-xs text-slate-400">

        Campos vazios não serão incluídos no JSON.

      </div>

    </div>
  );
}