export default function DataPreview({ data }) {
  if (!data?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
        Nenhum dado carregado
      </div>
    );
  }

  const headers = Object.keys(data[0]?.campos || {});

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
      <div className="px-5 py-4 border-b bg-slate-50 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">
            Preview da Planilha
          </h3>
          <p className="text-sm text-slate-500">
            Mostrando {Math.min(data.length, 5)} de {data.length} registros
          </p>
        </div>

        <div className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
          {headers.length} campos
        </div>
      </div>

      <div className="overflow-auto max-h-[500px]">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 sticky top-0">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.slice(0, 5).map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t hover:bg-slate-50"
              >
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-4 py-3 whitespace-nowrap text-slate-600"
                  >
                    {item.campos[header] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}