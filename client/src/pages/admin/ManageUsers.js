import React, { useEffect, useState } from "react";
import { apigetUsers } from "../../apis/user";
import { UserModal } from "../../components";
import moment from "moment";
import { roles } from "../../utils/contants";

const ManageUsers = () => {
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // "edit" or "delete"

  const fetchUsers = async () => {
    const res = await apigetUsers();
    if (res.success && Array.isArray(res.users)) {
      setUsers(res.users);
    } else {
      setUsers([]);
    }
  };

  const handleOpenModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    setUsers((prevUsers) =>
      Array.isArray(prevUsers)
        ? prevUsers.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        : []
    );
  };

  const handleUserDelete = (id) => {
    setUsers((prevUsers) =>
      Array.isArray(prevUsers)
        ? prevUsers.filter((user) => user._id !== id)
        : []
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Fullname</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Created At</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user, idx) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{idx + 1}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{`${user.firstname} ${user.lastname}`}</td>
                <td className="py-3 px-6 text-left">
                  {
                    roles?.find(
                      (role) => Number(role?.code) === Number(user.role)
                    )?.value
                  }
                </td>
                <td className="py-3 px-6 text-left">{user.mobile}</td>
                <td
                  className={`py-3 px-6 text-left ${
                    user.isBlocked ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </td>
                <td className="py-3 px-6 text-left">
                  {moment(user.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
                    onClick={() => handleOpenModal("edit", user)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleOpenModal("delete", user)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalType && (
        <UserModal
          type={modalType}
          user={selectedUser}
          onClose={handleCloseModal}
          onUserUpdate={handleUserUpdate}
          onUserDelete={handleUserDelete}
        />
      )}
    </div>
  );
};

export default ManageUsers;
