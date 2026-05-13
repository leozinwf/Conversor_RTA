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
  
  // NOVO: Sistema de template base configurável
  const [wrapperTemplate, setWrapperTemplate] = useState(
    '[\n  {\n    "items": "{{items}}",\n    "total": "{{total}}"\n  }\n]'
  );

  // Upload + processamento inicial
  const loadFile = async (file) => {
    try {
      setLoading(true);
      setError("");

      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setFileName(nameWithoutExt);

      const rows = await readExcel(file);
      const processed = processRows(rows);

      setData(processed);
      setJson(processed);
    } catch (err) {
      console.error(err);
      setError("Erro ao processar arquivo");
    } finally {
      setLoading(false);
    }
  };

  // NOVO: Função auxiliar para suportar aninhamento (dot notation)
  const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  };

  // Aplica mappings e template automaticamente
  useEffect(() => {
    if (!data.length) return;

    // Converte cada linha com suporte a objetos aninhados
    const items = data.map((item) => {
      const novosCampos = {};

      Object.entries(item.campos).forEach(([excelField, value]) => {
        const jsonField = mappings?.[excelField]?.trim() || excelField;
        setNestedValue(novosCampos, jsonField, value);
      });

      return novosCampos;
    });

    // Aplica a estrutura do Template Raiz
    try {
      const parsedTemplate = JSON.parse(wrapperTemplate);

      const replacePlaceholders = (obj) => {
        if (typeof obj === 'string') {
          if (obj === '{{items}}') return items;
          if (obj === '{{total}}') return String(items.length);
          return obj;
        }
        if (Array.isArray(obj)) return obj.map(replacePlaceholders);
        if (typeof obj === 'object' && obj !== null) {
          const newObj = {};
          for (let key in obj) {
            newObj[key] = replacePlaceholders(obj[key]);
          }
          return newObj;
        }
        return obj;
      };

      setJson(replacePlaceholders(parsedTemplate));
    } catch (e) {
      setJson({ error: "O template JSON da estrutura raiz é inválido. Verifique a sintaxe." });
    }

  }, [mappings, data, wrapperTemplate]);

  return {
    data,
    json,
    error,
    fileName,
    loading,
    mappings,
    setMappings,
    wrapperTemplate,       // Expondo o template para o componente
    setWrapperTemplate,    // Expondo o set para edição
    loadFile,
  };
};