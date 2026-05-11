export const cleanRow = (row) => {
  return row;
};

export const validateRow = (row, index) => {
  if (!row.campos || Object.keys(row.campos).length === 0) {
    throw new Error(`Linha ${index + 2}: linha vazia`);
  }
};

export const processRows = (rows) => {
  return rows.map((row, index) => {
    const cleaned = cleanRow(row);
    validateRow(cleaned, index);

    return cleaned;
  });
};