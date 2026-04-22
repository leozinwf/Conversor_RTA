import { useRef } from 'react';

export default function FileUpload({ onUpload }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">1. Carregar Arquivo</h3>
      <div 
        onClick={handleClick}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-colors cursor-pointer bg-gray-50 group"
      >
        <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-700">Clique para selecionar</p>
        <p className="text-xs text-slate-500 mt-1">.xlsx ou .xls</p>
        
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
    </div>
  );
}