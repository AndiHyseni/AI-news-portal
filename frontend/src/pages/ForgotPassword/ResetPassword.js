import { useState } from "react";
import axios from "axios";
import "../ForgotPassword/ForgotPassword.css";
import { Button, Input, Image, PasswordInput } from "@mantine/core";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";
import { useDisclosure } from "@mantine/hooks";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState();
  const [isError, setIsError] = useState();
  const { data: configData } = useConfiguration();
  const [visible, { toggle }] = useDisclosure(false);

  async function resetPassword() {
    let item = { email, password };
    try {
      await axios.post(
        "http://localhost:5000/api/Account/reset-password",
        item
      );
      setIsError(false);
      setData("Password changed successfully!");
      setEmail("");
      setPassword("");
    } catch (err) {
      setIsError(true);
      setData(err.response?.statusText || "An error occurred");
    }
  }

  return (
    <div className="wraper">
      <div className="containerr">
        <div className="textbox">
          {configData?.header_logo && (
            <Image
              src={configData.header_logo}
              height={80}
              width={80}
              style={{ placeSelf: "center" }}
              radius="md"
              className="reset-logo"
            />
          )}
          <h3 className="resetText">Reset Password</h3>
          <p className="paragrafff">Please enter your new password</p>
        </div>
        <div className="EmailInput">
          <label className="email-label">Email Address</label>
          <Input
            type="text"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="email-input"
            value={email}
            size="md"
          />
          <div className="space-between-inputs"></div>
          <label className="password-label">New Password</label>
          <PasswordInput
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            visible={visible}
            onVisibilityChange={toggle}
            className="password-input"
            size="md"
          />
          <Button onClick={resetPassword} className="butoniReset">
            Reset Password
          </Button>
          {data && (
            <div className="form-group">
              <div
                className={
                  isError ? "alert alert-danger" : "alert alert-success"
                }
                role="alert"
              >
                {data}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
