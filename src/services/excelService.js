import * as XLSX from "xlsx";

export const readExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, {
          type: "binary"
        });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet, {
          defval: "",
          raw: false
        });

        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};