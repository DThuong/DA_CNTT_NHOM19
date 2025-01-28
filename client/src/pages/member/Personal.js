// Personal.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { updateCurrent } from "../../store/user/userasyncActions";
import { InputForm } from "../../components";
import avatar from "../../assets/default-avatar.png";
import moment from "moment";

const Personal = () => {
  const dispatch = useDispatch();
  const { current, isLoading, error } = useSelector((state) => state.user); // Lấy current, isLoading, error từ Redux state
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("mobile", data.mobile);
    formData.append("email", data.email);

    // Kiểm tra và đính kèm avatar nếu có
    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    try {
      const res = await dispatch(updateCurrent(formData)).unwrap();
      if (res) {
        toast.success("User updated successfully!", { position: "top-right" });
        reset(); // Reset form sau khi cập nhật thành công
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update user!", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="w-full relative px-4">
      <h1 className="text-xl font-bold mb-4">Personal Information</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <InputForm
          label="First Name"
          name="firstname"
          register={register}
          defaultValue={current?.firstname}
          error={errors.firstname}
          rules={{ required: "First name is required" }}
        />
        <InputForm
          label="Last Name"
          name="lastname"
          register={register}
          defaultValue={current?.lastname}
          error={errors.lastname}
          rules={{ required: "Last name is required" }}
        />
        <InputForm
          label="Mobile"
          name="mobile"
          type="tel"
          register={register}
          defaultValue={current?.mobile}
          error={errors.mobile}
          rules={{ required: "Mobile number is required" }}
        />
        <InputForm
          label="Email"
          name="email"
          type="email"
          register={register}
          defaultValue={current?.email}
          error={errors.email}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          }}
        />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Created at:
          </label>
          <p className="py-2 px-3 bg-gray-100 border border-gray-300 rounded">
            {moment(current?.createdAt).format("DD.MM.YYYY")}
          </p>
        </div>

        {/* Avatar */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="avatar"
          >
            Avatar
          </label>
          <div className="mb-2">
            <img
              src={current?.avatar || avatar}
              alt="Current Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <input
            id="avatar"
            type="file"
            {...register("avatar", {
              validate: {
                fileType: (file) =>
                  (file[0] &&
                    ["image/jpeg", "image/png"].includes(file[0]?.type)) ||
                  "Only JPEG or PNG files are allowed",
                fileSize: (file) =>
                  (file[0] && file[0]?.size <= 5 * 1024 * 1024) ||
                  "File size must be less than 5MB",
              },
            })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.avatar && (
            <p className="text-red-500 text-xs italic">
              {errors.avatar.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading} // Disable submit when loading
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default Personal;