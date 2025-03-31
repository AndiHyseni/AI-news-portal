import { useState, useEffect } from "react";
import axios from "axios";
import "../ForgotPassword/ForgotPassword.css";
import { Button, Input } from "@mantine/core";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [data, setData] = useState();
  const [isError, setIsError] = useState();
  useEffect(() => {}, []);

  async function reset() {
    let item = { email, password, token };
    let result = await axios
      .post("https://localhost:5000/api/reset-password", item)
      .then((res) => {
        setIsError(false);
        setData("Password changed succesfully!");
        setEmail("");
        setPassword("");
      })
      .catch((err) => {
        setIsError(true);
        setData(err.response.statusText);
      });
  }

  return (
    <div className="wraper">
      <div className="containerr">
        <div className="textbox">
          <h3 className="resetText">Reset Your Password</h3>
          <p className="paragrafff">Please enter your new password</p>
        </div>
        <div className="col-sm-4 EmailInput">
          <Input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
          <br />
          <Input
            type="password"
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
          <br />
          <Button onClick={reset} className="btn btn-primary butoniReset">
            Reset
          </Button>
          <br />
          <br />
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
