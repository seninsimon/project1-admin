import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userBlockThunk, userManagementThunk } from "../features/userManagementSlice";
import "./UserManagement.css";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.usermanagement);

  useEffect(() => {
    dispatch(userManagementThunk());
  }, [dispatch]);


  const handleBlock = (id)=>
  {
    const token = localStorage.getItem("usertoken")
    const token2 = localStorage.getItem("authToken")
    if(token)
    {
      localStorage.removeItem("usertoken")
    }
    else if(token2)
    {
      localStorage.removeItem("authToken")
    }
    
    dispatch(userBlockThunk(id)).unwrap().then(()=>dispatch(userManagementThunk()))
    .catch(()=>console.log("error in user blocking") )
  }

  return (
    <div className="user-management-container">
      <h1 className="user-management-header">User Management</h1>

      <table className="user-management-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button  onClick={()=>handleBlock(user._id)} className="block-button">
                  {
                    user.isBlocked ? <p style={{color : "green"}} >unblock</p>: <p style={{color : "red"}} >block</p>
                  }
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
