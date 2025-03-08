import React, { useEffect, useState } from "react";
import { InputForm, Select } from "../../components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { validate } from "../../utils/helpers";
import { useCallback } from "react";

// Sample data
const data = [
  {
    cate: "Smartphone",
    brand: ["Apple", "Samsung", "LG", "Asus", "Nokia", "BlackBerry"],
  },
  {
    cate: "Tablet",
    brand: ["Apple", "Samsung", "Acer", "Asus", "Lenovo", "Haier"],
  },
  {
    cate: "Laptop",
    brand: ["Macbook", "Dell", "Acer", "Asus", "Lenovo", "Hp"],
  },
  {
    cate: "Accessories",
    brand: [
      "Headphone",
      "Bluetooth",
      "Keyboard",
      "Smartwatches",
      "Mouse",
      "Cases",
    ],
  },
  {
    cate: "Television",
    brand: ["Apple", "Samsung", "LG", "Asus", "Nokia", "BlackBerry"],
  },
  { cate: "Printer", brand: ["Samsung", "Acer", "Asus", "Lenovo", "Haier"] },
  { cate: "Speaker", brand: ["Samsung"] },
  { cate: "Camera", brand: ["Apple"] },
];

const CreateProducts = () => {
  const { categories } = useSelector((state) => state.app);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();

  const [payload, setpayload] = useState({ description: "" });
  const [invalidField, setinvalidField] = useState([]);

  const changeValue = useCallback((e) => {
    setpayload(e);
  }, [payload]);

  const handleCreateProduct = (data) => {
    console.log("Errors:", errors);  // Log the validation errors
    const invalid = validate(payload, setinvalidField);

    if (invalid === 0) {
      // Ensure category title is correctly set
      if (data.category)
        data.category = categories.find((el) => el._id === data.category)
          ?.title;

      const finalPayload = { ...data, ...payload };
      console.log("Final Payload:", finalPayload);  // Log final payload

      const formData = new FormData();
      for (let [key, value] of Object.entries(finalPayload)) {
        console.log("FormData Entry:", key, value);  // Log each entry being appended
        formData.append(key, value);
      }

      // Handle image files
      if (data.images && data.images.length) {
        Array.from(data.images).forEach((file) => {
          formData.append("images[]", file);
        });
      }

      // Log FormData entries for inspection
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      // Call API to submit the form data (use fetch or axios)
      // Example:
      // fetch("/api/endpoint", { method: "POST", body: formData });
    } else {
      console.log("Validation failed:", invalidField);  // Log errors if validation fails
    }
  };

  const categoryOptions =
    data?.map((el) => ({
      value: el.cate,
      label: el.cate,
    })) || [];

  const selectedCategory = data?.find((el) => el.cate === watch("category"));

  const brandOptions = selectedCategory
    ? selectedCategory.brand.map((el) => ({
        value: el,
        label: el,
      }))
    : [];

  useEffect(() => {
    console.log("Selected Category:", watch("category"));  // Log category change
  }, [watch("category")]);

  return (
    <div className="w-full text-[#0f0f0f]">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
        <span>Create New Product</span>
      </h1>
      <div className="p-6 space-y-6">
        <form
          onSubmit={handleSubmit(handleCreateProduct)}
          className="space-y-4"
        >
          <InputForm
            label="Product Name"
            name="title"
            register={register}
            rules={{ required: "Product name is required" }}
            placeholder="Enter product name"
            error={errors?.title}
          />
          <div className="flex gap-4">
            <InputForm
              label="Price"
              name="price"
              register={register}
              rules={{
                required: "Price is required",
                min: { value: 1, message: "Price must be greater than 0" },
              }}
              type="number"
              placeholder="Enter price"
              error={errors?.price}
            />
            <InputForm
              label="Quantity"
              name="quantity"
              register={register}
              rules={{ required: "Quantity is required" }}
              type="number"
              placeholder="Enter quantity"
              error={errors?.quantity}
            />
          </div>

          <div className="flex gap-4 w-full">
            {data && data.length > 0 && (
              <>
                <Select
                  label="Category"
                  options={categoryOptions}
                  register={register}
                  id="category"
                  rules={{ required: "This field is required" }}
                  style={{ flex: 1 }}
                  errors={errors}
                />
                <Select
                  label="Brand"
                  options={brandOptions}
                  register={register}
                  id="brand"
                  rules={{ required: "This field is required" }}
                  style={{ flex: 1 }}
                  errors={errors}
                />
              </>
            )}
          </div>

          <InputForm
            label="Description"
            name="description"
            register={register}
            rules={{ required: "Description is required" }}
            placeholder="Enter product description"
            error={errors?.description}
            textarea
            onChange={changeValue}
            className={
              invalidField.some((error) => error.field === "description")
                ? "border-red-500"
                : ""
            }
          />

          <div className="flex flex-col gap-2 mt-8">
            <label htmlFor="image" className="flex items-center space-x-2">
              <span className="font-semibold">Product Image</span>
              <input
                id="image"
                type="file"
                accept="image/*"
                {...register("image", { required: "Image is required" })}
                className="p-2 border rounded-md"
              />
            </label>
            {errors?.image && (
              <span className="text-red-500">{errors.image.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="images" className="flex items-center space-x-2">
              <span className="font-semibold">Product Images</span>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                {...register("images", {
                  required: "At least one image is required",
                })}
                className="p-2 border rounded-md"
              />
            </label>
            {errors?.images && (
              <span className="text-red-500">{errors.images.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 p-3 bg-blue-600 text-white rounded-md w-auto hover:bg-blue-700 transition duration-300"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
