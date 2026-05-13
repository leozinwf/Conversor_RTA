import * as XLSX from "xlsx";

export const readExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, {
          type: "binary",
          cellDates: true, // Transforma os códigos de data da planilha em Objetos Date nativos
        });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Converte para array bruto
        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
          raw: true, // IMPORTANTE: true pega o valor raiz (Objeto Date) ao invés do texto americano
        });

        if (!rows || rows.length === 0) {
          resolve([]);
          return;
        }

        // Primeira linha = cabeçalhos
        const headers = rows[0].map((header, index) => {
          const value = String(header || "").trim();
          if (!value) return `IGNORAR_${index}`;
          return value;
        });

        // NOVA FUNÇÃO: Força qualquer data para o padrão brasileiro DD/MM/YYYY
        const formatValue = (value) => {
          // 1. Se for um objeto de Data vindo direto do Excel
          if (value instanceof Date) {
            const dd = String(value.getDate()).padStart(2, '0');
            const mm = String(value.getMonth() + 1).padStart(2, '0');
            const yyyy = value.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
          }
          
          // 2. Se for um texto formato Banco de Dados "YYYY-MM-DD" (Comum em arquivos CSV)
          if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value)) {
            const part = value.split('T')[0];
            const [y, m, d] = part.split('-');
            return `${d}/${m}/${y}`;
          }

          // 3. Se for um texto ou número comum
          return typeof value === "string" 
            ? value.trim() 
            : (value !== undefined && value !== null ? String(value) : "");
        };

        // Converte linhas aplicando a formatação customizada
        const formattedRows = rows.slice(1).map((row) => {
          const campos = {};

          headers.forEach((header, index) => {
            if (!header.startsWith("IGNORAR_")) {
              campos[header] = formatValue(row[index]);
            }
          });

          return { campos };
        });

        resolve(formattedRows);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};