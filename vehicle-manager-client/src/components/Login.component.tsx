import { useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Divider, message } from "antd";
import axios from "../util/api";
import { AxiosError } from "axios";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

interface FormFields {
  password: string;
  email: string;
}

type LocationState = {
  from: {
    pathname: string;
  };
};

const Login = () => {
  const [form] = Form.useForm();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname || "/";

  const usernameRef = useRef<Input>(null);

  const handleSubmit = async (values: FormFields) => {
    const { password, email } = values;
    try {
      const result = await axios.post(
        "/user/signin",
        JSON.stringify({ password, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const {
        data: { user },
      } = result.data;
      setUser(user);
      form.resetFields();

      navigate(from, { replace: true });
      message.success("Login Successful!");
    } catch (e) {
      if ((e as AxiosError).response?.status === 401) {
        message.error("Email or password incorrect");
      } else {
        message.error("User login failed, try again later");
      }
    }
  };

  //   useEffect(() => {
  //     const fetch = async () => {
  //       const result = await axios.post("/user/signin", {
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true,
  //       });
  //       const {
  //         data: { user },
  //       } = result.data;
  //       setUser(user);
  //       navigate("/");
  //     };
  //     fetch();
  //   }, []);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  return (
    <section className="login-form">
      <h2 className="site-page-header"> Login Form </h2>
      <Divider />
      <Form
        {...formItemLayout}
        form={form}
        name="login"
        onFinish={handleSubmit}
        scrollToFirstError
        layout="vertical"
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input ref={usernameRef} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", height: "40px" }}
          >
            Login
          </Button>
        </Form.Item>
        <p style={{ fontSize: "20px", margin: 0 }}> Need an account? </p>
        <Link
          to="/register"
          style={{ fontSize: "20px", textDecoration: "underline" }}
        >
          Sign Up
        </Link>
      </Form>
    </section>
  );
};

export default Login;
