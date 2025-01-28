import React, { useState } from "react";
import { Button } from "../../components";
import { apiRegister, apiLogin, apiForgotPassword } from "../../apis/user";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/user/userSlice";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  // Schema validation
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const registerSchema = Yup.object().shape({
    firstname: Yup.string().required("First Name is required"),
    lastname: Yup.string().required("Last Name is required"),
    mobile: Yup.string().required("Mobile is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Handle submission
  const handleSubmit = async (values) => {
    setIsLoading(true); // Bật trạng thái loading
    if (isRegister) {
      const res = await apiRegister(values);
      if (res.success) {
        Swal.fire("Congratulation", res.msg, "success").then(() => {
          setIsRegister(false);
        });
      } else {
        Swal.fire("Oops", res.msg, "error");
      }
    } else {
      const res = await apiLogin(values);
      if (res.success) {
        dispatch(
          login({
            isLoggedIn: true,
            token: res.accessToken,
            userData: res.msg,
          })
        );
        navigate("/");
      } else {
        Swal.fire("Oops", res.msg, "error");
      }
    }
    setIsLoading(false); // Tắt trạng thái loading
  };

  const handleForgotPassword = async (values) => {
    const res = await apiForgotPassword({ email: values.email });
    if (res.success) {
      toast.success(res.msg, { theme: "colored" });
    } else {
      toast.info(res.msg, { theme: "colored" });
    }
  };

  return (
    <div className="w-screen h-screen relative">
      {isForgotPassword && (
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-white flex justify-center py-8 z-50 animate-slide-right">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email format")
                .required("Email is required"),
            })}
            onSubmit={handleForgotPassword}
          >
            {() => (
              <Form className="flex flex-col gap-4">
                <label htmlFor="email">Enter your email: </label>
                <Field
                  type="text"
                  name="email"
                  id="email"
                  className="w-[800px] pb-4 border-b outline-none placeholder:text-sm"
                  placeholder="example: abc@gmail.com"
                />
                <ErrorMessage
                  name="email"
                  component="small"
                  className="text-red-500"
                />
                <div className="flex items-center justify-end w-full gap-2">
                  <Button
                    name="Back"
                    handleOnClick={() => setIsForgotPassword(false)}
                  />
                  <Button
                    name="Submit"
                    type="submit"
                    style="px-4 py-2 rounded-md text-white bg-blue-500 text-semibold w-full outline-none"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <img
        src="https://static.vecteezy.com/system/resources/previews/028/792/419/large_2x/e-commerce-shopping-cart-with-multiple-products-a-sunlit-abstract-background-e-commerce-concept-ai-generative-free-photo.jpg"
        alt="background login"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 bottom-0 left-1/2 right-0 flex items-center justify-center">
        <div className="p-8 bg-white flex flex-col items-center rounded-md min-w-[500px]">
          <h1 className="text-[28px] font-semibold text-main mb-8">
            {isRegister ? "Register" : "Login"}
          </h1>
          <Formik
            initialValues={{
              firstname: "",
              lastname: "",
              mobile: "",
              email: "",
              password: "",
            }}
            validationSchema={isRegister ? registerSchema : loginSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="w-full flex flex-col gap-y-4">
                {isRegister && (
                  <div className="flex items-center gap-4">
                    <div className="w-full">
                      <Field
                        name="firstname"
                        placeholder="First Name"
                        className="px-4 py-2 rounded-md placeholder:text-sm border w-full focus:outline-blue-500"
                        style={{ height: "40px" }} // Chiều cao cố định
                      />
                      <ErrorMessage
                        name="firstname"
                        component="small"
                        className="text-red-500 block min-h-[16px]" // Chiều cao tối thiểu cho lỗi
                      />
                    </div>
                    <div className="w-full">
                      <Field
                        name="lastname"
                        placeholder="Last Name"
                        className="px-4 py-2 rounded-md placeholder:text-sm border w-full focus:outline-blue-500"
                        style={{ height: "40px" }} // Chiều cao cố định
                      />
                      <ErrorMessage
                        name="lastname"
                        component="small"
                        className="text-red-500 block min-h-[16px]" // Chiều cao tối thiểu cho lỗi
                      />
                    </div>
                  </div>
                )}
                {isRegister && (
                  <div>
                    <Field
                      name="mobile"
                      placeholder="Mobile"
                      className="px-4 py-2 rounded-md placeholder:text-sm border w-full focus:outline-blue-500"
                      style={{ height: "40px" }} // Chiều cao cố định
                    />
                    <ErrorMessage
                      name="mobile"
                      component="small"
                      className="text-red-500 block min-h-[16px]" // Chiều cao tối thiểu cho lỗi
                    />
                  </div>
                )}
                <div>
                  <Field
                    name="email"
                    placeholder="Email"
                    className="px-4 py-2 rounded-md placeholder:text-sm border w-full focus:outline-blue-500"
                    style={{ height: "40px" }} // Chiều cao cố định
                  />
                  <ErrorMessage
                    name="email"
                    component="small"
                    className="text-red-500 block min-h-[16px]" // Chiều cao tối thiểu cho lỗi
                  />
                </div>
                <div>
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="px-4 py-2 rounded-md placeholder:text-sm border w-full focus:outline-blue-500"
                    style={{ height: "40px" }} // Chiều cao cố định
                  />
                  <ErrorMessage
                    name="password"
                    component="small"
                    className="text-red-500 block min-h-[16px]" // Chiều cao tối thiểu cho lỗi
                  />
                </div>

                {/* Hiển thị loader khi đang xử lý */}
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <TailSpin color="#00BFFF" height={40} width={40} />
                  </div>
                ) : (
                  <Button
                    name={isRegister ? "Register" : "Login"}
                    type="submit"
                    style="w-full py-2 px-4 bg-blue-500 text-white rounded-md"
                  />
                )}
              </Form>
            )}
          </Formik>
          <div className="flex items-center justify-between my-2 w-full text-sm">
            {!isRegister && (
              <>
                <span
                  onClick={() => setIsForgotPassword(true)}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Forgot your account
                </span>
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => setIsRegister(true)}
                >
                  Create account
                </span>
              </>
            )}
            {isRegister && (
              <span
                className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                onClick={() => setIsRegister(false)}
              >
                Go Login
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
