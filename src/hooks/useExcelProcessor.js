import { useState } from "react";
import { readExcel } from "../services/excelService";
import { processRows } from "../utils/dataUtils";

export const useExcelProcessor = () => {
  const [data, setData] = useState([]);
  const [json, setJson] = useState([]);
  const [error, setError] = useState("");

  const loadFile = async (file) => {
    try {
      const rows = await readExcel(file);
      setData(rows);
      setJson([]);
      setError("");
    } catch (err) {
      setError("Erro ao ler arquivo");
    }
  };

  const generateJson = () => {
    try {
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
    loadFile,
    generateJson
  };
};