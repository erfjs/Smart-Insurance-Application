import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ColumnSelector from "./ColumnSelector";
import { Submission } from "./types";

interface SubmissionListProps {
  submissions: Submission[];
  columns: string[];
}

const SubmissionList: React.FC<SubmissionListProps> = ({
  submissions,
  columns,
}) => {
  // پیش‌فرض همه ستون‌ها انتخاب‌شده باشن، مگر اینکه از localStorage چیزی بخونیم
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
    const savedColumns = localStorage.getItem("selectedColumns");
    return savedColumns ? JSON.parse(savedColumns) : columns;
  });
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>(columns[0] || "");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ذخیره انتخاب‌ها توی localStorage وقتی selectedColumns تغییر می‌کنه
  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns));
    console.log("ستون‌های انتخاب‌شده ذخیره شدند:", selectedColumns);
  }, [selectedColumns]);

  const filteredSubmissions = submissions.filter((submission) =>
    Object.values(submission).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedSubmissions = filteredSubmissions.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (order === "asc") return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });

  const paginatedSubmissions = sortedSubmissions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (column: string) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  return (
    <div>
      <TextField
        label='Search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        margin='normal'
      />
      <ColumnSelector
        columns={columns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
      <Table>
        <TableHead>
          <TableRow>
            {selectedColumns.map((col) => (
              <TableCell key={col}>
                <TableSortLabel
                  active={orderBy === col}
                  direction={orderBy === col ? order : "asc"}
                  onClick={() => handleSort(col)}
                >
                  {col}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              {selectedColumns.map((col) => (
                <TableCell key={col}>{submission[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredSubmissions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </div>
  );
};

export default SubmissionList;
