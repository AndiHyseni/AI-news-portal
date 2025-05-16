import { useState, useEffect } from "react";
import axios from "axios";
import "../ForgotPassword/ForgotPassword.css";
import { Button, Input, Image } from "@mantine/core";
import { useConfiguration } from "../../hooks/useConfiguration/useConfiguration";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState();
  const [isError, setIsError] = useState();
  const { data: configData } = useConfiguration();

  async function resetPassword() {
    let item = { email };
    try {
      await axios.post(
        "http://localhost:5000/api/Account/forgot-password",
        item
      );
      setIsError(false);
      setData("A reset link has been sent!");
      setEmail("");
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
          <p className="paragrafff">
            Lost your password? Please enter your email address. <br />
            You will receive a link to create a new password via email.
          </p>
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
          <Button onClick={resetPassword} className="butoniReset">
            Send Reset Link
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

export default ForgotPassword;
