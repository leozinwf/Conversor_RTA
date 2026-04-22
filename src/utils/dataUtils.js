export const cleanRow = (row) => {
  const cleaned = {};

  Object.keys(row).forEach((key) => {
    cleaned[key] =
      typeof row[key] === "string" ? row[key].trim() : row[key];
  });

  return cleaned;
};

export const validateRow = (row, index) => {
  if (!row.nomeContrato) {
    throw new Error(`Linha ${index + 2}: nomeContrato obrigatório`);
  }
};

export const processRows = (rows) => {
  return rows.map((row, index) => {
    const cleaned = cleanRow(row);
    validateRow(cleaned, index);
    return cleaned;
  });
};