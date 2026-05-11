import * as XLSX from "xlsx";

export const readExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, {
          type: "binary",
        });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Converte para array bruto
        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
          raw: false,
        });

        if (!rows || rows.length === 0) {
          resolve([]);
          return;
        }

        // Primeira linha = cabeçalhos
        const headers = rows[0].map((header, index) => {
          const value = String(header || "").trim();

          // Ignora colunas vazias
          if (!value) {
            return `IGNORAR_${index}`;
          }

          return value;
        });

        // Converte linhas
        const formattedRows = rows.slice(1).map((row) => {
          const campos = {};

          headers.forEach((header, index) => {
            // Ignora headers vazios
            if (!header.startsWith("IGNORAR_")) {
              campos[header] =
                typeof row[index] === "string"
                  ? row[index].trim()
                  : row[index] || "";
            }
          });

          return {
            campos,
          };
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