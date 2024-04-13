import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { userLogin, LoginParamsForm } from "../features/auth/authActions";
import { useNavigate } from "react-router-dom";
// import { isAllOf } from '@reduxjs/toolkit'
import { Switch } from "antd";

export default function Login() {
  // [todo] use error data
  const { userName, loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(false);
  const changeRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  // Redirect if logged-in
  useEffect(() => {
    if (userName !== null) {
      // [todo] enhancement
      navigate("/Admin");
    }
  }, [userName]);

  const dispatch = useAppDispatch();

  const { register, handleSubmit } = useForm();

  const submitForm = (data: any) => {
    let formData = data as LoginParamsForm;
    formData.rememberMe = rememberMe;
    // dispatch function can accept the thunk object as parameter directly
    dispatch(userLogin(formData));
  };

  return (
    // [todo]
    // 1. Use Kapibara-icon picture
    // 2. Handle token-expired
    <>
      <title>Kapibara Login</title>

      <div className="grid size-full grid-cols-3 grid-rows-3">
        <div className="col-start-2 row-start-2">
          {/* Login-card title */}
          <div className=" flex min-h-full w-1/2 min-w-full flex-1 flex-col lg:px-8">
            <div className="flex max-w-xl flex-row sm:mx-auto">
              <img className="m-2 mx-auto h-14 w-14" src="/kapibara.png" />
              <h2 className="m-4 font-worksans-extrabold text-5xl leading-9 tracking-tight text-gray-900">
                Kapibara
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block font-worksans-bold text-lg leading-6 text-gray-900">
                      Account
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="account"
                      type="text"
                      {...register("account")}
                      required
                      className="form-input block w-full rounded-lg border-2 border-stone-300 py-1.5 pl-2 text-gray-900 outline-none placeholder:text-gray-400 focus:border-groovyfunk-4 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block font-worksans-bold text-lg leading-6 text-gray-900">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      type="password"
                      {...register("password")}
                      autoComplete="current-password"
                      required
                      className="form-input block w-full rounded-lg border-2 border-stone-300 py-1.5 pl-2 shadow-sm outline-none focus:border-groovyfunk-4 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-end space-x-2 font-worksans-medium">
                  <p>Remember Me</p>
                  <div>
                    <Switch
                      checked={rememberMe}
                      onClick={changeRememberMe}
                      className="bg-stone-200"
                    />
                  </div>
                </div>

                <div className="flex h-12 w-full justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="login-button flex w-full justify-center rounded-lg bg-groovyfunk-4 p-2 font-worksans-bold text-lg text-[#FFFFFF] shadow-sm"
                  >
                    Log in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
