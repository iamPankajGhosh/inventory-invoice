import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { FaC } from "react-icons/fa6";
import axios from "axios";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (value) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/users/login`,
        value
      );
      if (res.data.message === "Login Fail") {
        setIsLoading(false);
        return message.error("User Not Found");
      } else {
        setIsLoading(false);
        message.success("User Logged-In Successfully");
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate("/");
      }
    } catch (error) {
      message.error("Something Went Wrong");
      setIsLoading(false);
      console.log(error);
    }
  };

  //currently login  user
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      localStorage.getItem("auth");
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="register">
      <div className="regsiter-form">
        <h1>Login</h1>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="userId" label="User ID">
            <Input required />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input required type="password" />
          </Form.Item>
          {/* <p className="test-creds">UserId: 123 | Password: 123</p> */}
          <div className="d-flex justify-content-between">
            <Button type="primary" htmlType="submit">
              {isLoading ? <FaC size={20} className="loader" /> : "Login"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
