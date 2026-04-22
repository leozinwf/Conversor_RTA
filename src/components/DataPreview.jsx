export default function DataPreview({ data }) {
  return (
    <div className="border p-2 h-[400px] overflow-auto">
      <h2 className="font-bold mb-2">Preview</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}