import FileUpload from "./components/FileUpload";
import DataPreview from "./components/DataPreview";
import JsonPreview from "./components/JsonPreview";
import ActionButtons from "./components/ActionButtons";
import { useExcelProcessor } from "./hooks/useExcelProcessor";

export default function App() {
  const { data, json, error, loadFile, generateJson } = useExcelProcessor();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Excel → RTA JSON
      </h1>

      <FileUpload onUpload={loadFile} />

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <DataPreview data={data} />
        <JsonPreview json={json} />
      </div>

      <ActionButtons onGenerate={generateJson} json={json} />
    </div>
  );
}