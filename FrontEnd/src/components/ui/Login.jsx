import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        "https://instaflow.onrender.com/api/v2/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">
            Login To see photos and videos from your friends
          </p>
        </div>
        <div>
          <label className="font-medium">Email</label>
          <br></br>
          <Input
            type="email"
            placeholder="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <label className="font-medium">Password</label>
          <br></br>
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 animate-spin" />
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}
        <span className="text-center">
          Dosen't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>{" "}
        </span>
      </form>
    </div>
  );
}

export default Login;
