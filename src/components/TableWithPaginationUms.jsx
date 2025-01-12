import React, { useState } from "react";
import PropTypes from "prop-types";

const TableWithPaginationUms = ({ columns, data, rowsPerPage, onAction }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination logic
    const totalRows = data.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="mx-auto my-8  w-full max-w-5xl">
            <table className="table-auto w-full border-collapse border border-gray-200 shadow-lg">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        {columns.map((column) => (
                            <th
                                key={column.accessor}
                                className="px-4 py-2 border-b border-gray-300 text-sm font-semibold text-gray-700"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, index) => (
                        <tr
                            key={index}
                            className="even:bg-gray-50 odd:bg-white hover:bg-gray-100"
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.accessor}
                                    className="px-4 py-2 border-b text-sm text-gray-600"
                                >
                                    {column.render
                                        ? column.render(row[column.accessor], row)
                                        : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${currentPage === 1
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                >
                    Previous
                </button>
                <span className="text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${currentPage === totalPages
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

TableWithPaginationUms.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            header: PropTypes.string.isRequired,
            accessor: PropTypes.string.isRequired,
            render: PropTypes.func,
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    rowsPerPage: PropTypes.number,
    onAction: PropTypes.func,
};

TableWithPaginationUms.defaultProps = {
    rowsPerPage: 5,
    onAction: () => { },
};

export default TableWithPaginationUms;
