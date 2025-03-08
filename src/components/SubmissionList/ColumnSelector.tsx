import React from "react";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

interface ColumnSelectorProps {
  columns: string[];
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedColumns,
  setSelectedColumns,
}) => {
  console.log("columns در ColumnSelector:", columns);
  console.log("selectedColumns در ColumnSelector:", selectedColumns);

  const handleChange = (column: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, column]);
    } else {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant='h6'>انتخاب ستون‌ها</Typography>
      {columns.map((column) => (
        <FormControlLabel
          key={column}
          control={
            <Checkbox
              checked={selectedColumns.includes(column)}
              onChange={(e) => handleChange(column, e.target.checked)}
            />
          }
          label={column}
        />
      ))}
    </Box>
  );
};

export default ColumnSelector;
