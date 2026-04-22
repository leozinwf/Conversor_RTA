import { useState } from "react";
import { readExcel } from "../services/excelService";
import { processRows } from "../utils/dataUtils";

export const useExcelProcessor = () => {
  const [data, setData] = useState([]);
  const [json, setJson] = useState([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState(""); // Novo estado para o nome

  const loadFile = async (file) => {
    try {
      setError("");
      
      // Remove a extensão do arquivo para usar apenas o nome
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setFileName(nameWithoutExt);

      // Usando a sua função original readExcel
      const rows = await readExcel(file);
      setData(rows);
      setJson([]);
    } catch (err) {
      setError("Erro ao ler arquivo");
      console.error(err);
    }
  };

  const generateJson = () => {
    try {
      if (data.length === 0) {
        setError("Não há dados para converter.");
        return;
      }
      
      // Mantendo o uso do seu utils original
      const result = processRows(data);
      setJson(result);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    data,
    json,
    error,
    fileName, // Retornando a variável para ser usada no App.jsx
    loadFile,
    generateJson
  };
};