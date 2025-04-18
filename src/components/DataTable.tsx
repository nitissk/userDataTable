import React, { useState, useMemo } from "react";
import { User } from "../types";
import "./DataTable.css";

interface DataTableProps {
  data: User[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [searchText, setSearchText] = useState("");
  const [sortKey, setSortKey] = useState<keyof User | null>(null); 
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (key: keyof User) => {
    
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, data]);

  // const sortedData = useMemo(() => {
  //   if (!sortKey) return filteredData;

  //   return [...filteredData].sort((a, b) => {
  //     const valueA = a[sortKey];
  //     const valueB = b[sortKey];

  //     return sortDirection === "asc"
  //       ? String(valueA).localeCompare(String(valueB))
  //       : String(valueB).localeCompare(String(valueA));
  //   });
  // }, [filteredData, sortKey, sortDirection]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valueA = String(a[sortKey]).toLowerCase();
      const valueB = String(b[sortKey]).toLowerCase();

      if (sortDirection === "asc") {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      } else {
        if (valueA > valueB) return -1;
        if (valueA < valueB) return 1;
        return 0;
      }
    });
  }, [filteredData, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div style={{ textAlign: "right", marginBottom: "8px" }}>
        <label>
          Rows per page:{" "}
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>
      </div>

      {paginatedData.length === 0 ? (
        <p className="noData">No matching data found.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                {["name", "email", "role", "status"].map((key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key as keyof User)}
                    style={{ cursor: "pointer" }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortKey === key &&
                      (sortDirection === "asc" ? " 🔼" : " 🔽")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "even-row" : "odd-row"}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={`status-button ${
                        user.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          <p className="entry-count">
            Showing {(currentPage - 1) * rowsPerPage + 1}–
            {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </p>
        </>
      )}
    </div>
  );
};

export default DataTable;
