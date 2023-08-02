import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authenticationService } from "../_services/authentication";
import './loginpage.css'
class LoginPage extends React.Component {
  constructor(props) {
    super(props);

     // redirect to home if already logged in
     if (authenticationService.currentUserValue !== null) {
      this.props.history.push("/gis-portal");
    } else {
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <div className="login-container">
  
        <div className="login-div">
    
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().required(
                <h6
                  style={{
                    color: "#da542e",
                    fontSize: "80%",
                    display: "block",
                    fontWeight: "500",
                  }}
                >
                  Username is required
                </h6>
              ),
              password: Yup.string().required(
                <h6
                  style={{
                    color: "#da542e",
                    fontSize: "80%",
                    display: "block",
                    fontWeight: "500",
                  }}
                >
                  Password is required
                </h6>
              ),
            })}
            onSubmit={(
              { username, password },
              { setStatus, setSubmitting }
            ) => {
              setStatus();
              authenticationService.login(username, password).then(
                (user) => {
                  const { from } = window.location.reload(true) || {
                    from: { pathname: "/" },
                  };
                  this.props.history.push(from);
                },
                (error) => {
                  setSubmitting(false);
                  setStatus(error);
                }
              );
            }}
            render={({ errors, status, touched, isSubmitting }) => (
              <Form>
                <h2 className="heading">Login</h2>
                <div className="form-label-group">
                  <label
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <div className="userField">
                    <Field
                      style={{ boxShadow: "2px 2px #202020" }}
                      name="username"
                      type="text"
                      className={
                        "form-control" +
                        (errors.username && touched.username
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
                <br/>
                <div className="form-label-group">
                  <label
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="passwordField">
                    <Field
                      name="password"
                      type="password"
                      className={
                        "form-control" +
                        (errors.password && touched.password
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                </div>
                <br/>
                <div className="form-group">
                  <button
     
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Login
                  </button>
                </div>
                {status && <div className={"alert alert-danger"}>{status}</div>}
              </Form>
            )}
          />
        </div>
      </div>
    );
  }
}

export default LoginPage;

