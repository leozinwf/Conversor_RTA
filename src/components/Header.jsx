// src/components/Header.jsx
export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="https://dootax.com.br/wp-content/themes/dootax/assets/imgs/logo_dootax_principal.svg" 
            alt="Dootax Logo" 
            className="h-10 w-auto"
          />
          <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-none">Conversor_RTA</h1>
            <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">Soluções Fiscais Inteligentes</span>
          </div>
        </div>
      </div>
    </header>
  );
}