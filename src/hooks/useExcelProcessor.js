import { useState, useEffect } from "react";
import { readExcel } from "../services/excelService";
import { processRows } from "../utils/dataUtils";

export const useExcelProcessor = () => {
  const [data, setData] = useState([]);
  const [json, setJson] = useState([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  // Sistema de mapeamento
  const [mappings, setMappings] = useState({});

  // Upload + processamento inicial
  const loadFile = async (file) => {
    try {
      setLoading(true);
      setError("");

      // Nome do arquivo sem extensão
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setFileName(nameWithoutExt);

      // Lê Excel
      const rows = await readExcel(file);

      // Processa linhas
      const processed = processRows(rows);

      // Salva dados
      setData(processed);

      // JSON inicial
      setJson(processed);

    } catch (err) {
      console.error(err);
      setError("Erro ao processar arquivo");
    } finally {
      setLoading(false);
    }
  };

  // Aplica mappings automaticamente
  useEffect(() => {

  if (!data.length) return;

  // Converte cada linha
  const items = data.map((item) => {

    const novosCampos = {};

    Object.entries(item.campos).forEach(([excelField, value]) => {

      // Usa mapping se existir
      // Senão usa nome original
      const jsonField =
        mappings?.[excelField]?.trim() ||
        excelField;

      novosCampos[jsonField] = value;

    });

    return novosCampos;

  });

  // Estrutura final
  setJson([
    {
      items,
      total: String(items.length),
    },
  ]);

}, [mappings, data]);

  return {
    data,
    json,
    error,
    fileName,
    loading,

    // Mapping
    mappings,
    setMappings,

    // Actions
    loadFile,
  };
};