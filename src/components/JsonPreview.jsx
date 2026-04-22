export default function JsonPreview({ json }) {
  return (
    <div className="border p-2 h-[400px] overflow-auto">
      <h2 className="font-bold mb-2">JSON</h2>
      <pre>{JSON.stringify(json, null, 2)}</pre>
    </div>
  );
}