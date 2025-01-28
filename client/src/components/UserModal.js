import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiUpdateUsers, apiDeleteUser, apiBlockUser } from "../apis";

const UserModal = ({ type, user, onClose, onUserUpdate, onUserDelete }) => {
  const { register, handleSubmit, reset } = useForm();

  // Reset form values whenever `user` changes
  useEffect(() => {
    if (user) {
      reset({
        email: user?.email || "Email",
        firstname: user?.firstname || "First Name",
        lastname: user?.lastname || "Last Name",
        mobile: user?.mobile || "Mobile",
        role: user?.role === "Admin" ? "2002" : "2024",
        status: user?.isBlocked ? "Blocked" : "Active",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      if (type === "edit") {
        // Chuyển đổi lại giá trị role từ mã số sang chuỗi trước khi gửi API
        const updatedData = {
          ...data,
        };

        // Include user ID in the data payload
        const uid = user?._id; // lấy uid từ dữ liệu user

        // Call API to update user
        const response = await apiUpdateUsers(uid, updatedData);
        if (response.success) onUserUpdate(response.UPdatedUser);

        // Xử lý thay đổi trạng thái khóa/mở khóa
        const shouldBlock = data.status === "Blocked"; // So sánh trực tiếp với giá trị chuỗi
        if (shouldBlock !== user?.isBlocked) {
          const res = await apiBlockUser(user?._id, shouldBlock);
          if (res.success) onUserUpdate({ ...user, isBlocked: shouldBlock });
        }
      } else if (type === "delete") {
        // Call your delete API here
        const res = await apiDeleteUser(user?._id);
        if (res.success) onUserDelete(user?._id);
      }

      onClose(); // Close the modal after success
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-[400px] rounded shadow-lg p-6">
        {type === "edit" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="text-black">
            <h2 className="text-xl font-bold mb-4 text-center">Edit User</h2>
            <div className="mb-4">
              <label className="block mb-2 text-sm">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full border px-3 py-2 rounded"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm">First Name</label>
              <input
                {...register("firstname")}
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm">Last Name</label>
              <input
                {...register("lastname")}
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm">Phone</label>
              <input
                {...register("mobile")}
                type="text"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm">Role</label>
              <select
                {...register("role", { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="2002">Admin</option>
                <option value="2024">User</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm">Status</label>
              <select
                {...register("status")}
                className={`w-full border px-3 py-2 rounded ${
                  user?.isBlocked
                    ? "text-red-500 font-semibold"
                    : "text-green-500 font-semibold"
                }`}
              >
                <option value="Blocked" className="text-red-500">
                  Blocked
                </option>
                <option value="Active" className="text-green-500">
                  Active
                </option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="text-black">
            <h2 className="text-xl font-bold mb-4">Delete User</h2>
            <p>
              Are you sure you want to delete:{" "}
              <span className="text-bold">{user?.email}</span>?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserModal;
