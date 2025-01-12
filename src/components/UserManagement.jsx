import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userBlockThunk, userManagementThunk } from "../features/userManagementSlice";
import TableWithPaginationUms from "./TableWithPaginationUms";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.usermanagement);

  useEffect(() => {
    dispatch(userManagementThunk());
  }, [dispatch]);

  const handleBlock = (id) => {
    const token = localStorage.getItem("usertoken");
    const token2 = localStorage.getItem("authToken");

    if (token) {
      localStorage.removeItem("usertoken");
    } else if (token2) {
      localStorage.removeItem("authToken");
    }

    dispatch(userBlockThunk(id))
      .unwrap()
      .then(() => dispatch(userManagementThunk()))
      .catch(() => console.log("Error in user blocking"));
  };

  const columns = [
    {
      header: "ID",
      accessor: "_id",
    },
    {
      header: "Username",
      accessor: "username",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Action",
      accessor: "action",
      render: (value, row) => (
        <button
          onClick={() => handleBlock(row._id)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            row.isBlocked
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-red-100 text-red-600 hover:bg-red-200"
          }`}
        >
          {row.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
    },
  ];

  return (
    <div className="user-management-container px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
      <TableWithPaginationUms
        columns={columns}
        data={users}
        rowsPerPage={10}
        className="shadow-lg border border-gray-200 rounded-lg bg-white"
      />
    </div>
  );
};

export default UserManagement;
