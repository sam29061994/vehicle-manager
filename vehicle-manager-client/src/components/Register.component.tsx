import { useRef, useEffect } from "react";
import { Form, Input, Button, Checkbox, message, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import axios from "../util/api";

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
  name: string;
  password: string;
  email: string;
  passwordConfirm: string;
  agreement: boolean;
}

const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const usernameRef = useRef<Input>(null);

  const handleSubmit = async (values: FormFields) => {
    const { name, password, email, passwordConfirm } = values;
    try {
      await axios.post(
        "/user/signup",
        JSON.stringify({ name, password, email, passwordConfirm }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      form.resetFields();
      navigate("/login");
      message.success("User has been created!");
    } catch (e) {
      if ((e as AxiosError).response?.status === 409) {
        message.error("User already exists");
      } else {
      }
      message.error("User registration failed, try again later");
    }
  };

  useEffect(() => {
    usernameRef.current?.focus();
  });

  return (
    <section className="register-form">
      <h2 className="site-page-header"> Registration Form </h2>
      <Divider />
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={handleSubmit}
        scrollToFirstError
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Full Name"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your nname!",
            },
            { whitespace: true },
            {
              min: 3,
              message: "Name should be at least 3 characters",
            },
            {
              max: 12,
              message: "Name should not exceed over 12 characters",
            },
          ]}
        >
          <Input ref={usernameRef} />
        </Form.Item>
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
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          help="Min 8 char, one symbol, upper and lower case letters and a number"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              validator: (_, value) => {
                if (passwordRegex.test(value)) return Promise.resolve();
                return Promise.reject(
                  new Error("Password does not meet required parameters")
                );
              },
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="passwordConfirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Should accept agreement")),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="/going-nowhere">agreement</a>
          </Checkbox>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", height: "40px" }}
          >
            Sign Up
          </Button>
        </Form.Item>
        <p style={{ fontSize: "20px", margin: 0 }}> Already Registered? </p>
        <Link
          to="/login"
          style={{ fontSize: "20px", textDecoration: "underline" }}
        >
          Sign In
        </Link>
      </Form>
    </section>
  );
};

export default Register;
