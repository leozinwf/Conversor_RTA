export default function ActionButtons({ onGenerate, json }) {
  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dados.json";
    a.click();
  };

  return (
    <div className="flex gap-2 mt-4">
      <button onClick={onGenerate} className="bg-blue-500 text-white px-4 py-2">
        Gerar JSON
      </button>

      <button onClick={copyJSON} className="bg-green-500 text-white px-4 py-2">
        Copiar
      </button>

      <button onClick={downloadJSON} className="bg-gray-700 text-white px-4 py-2">
        Download
      </button>
    </div>
  );
}