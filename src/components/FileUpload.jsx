export default function FileUpload({ onUpload }) {
    return (
        <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => onUpload(e.target.files[0])}
            className="mb-4 block w-full text-sm text-gray-700
             file:mr-4 file:py-2 file:px-4
             file:rounded-lg file:border-0
             file:bg-blue-500 file:text-white
             hover:file:bg-blue-600"
        />
    );
}