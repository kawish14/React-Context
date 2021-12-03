import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authenticationService } from '../_services/authentication';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

    // redirect to home if already logged in
    if (authenticationService.currentUserValue) {
        this.props.history.push('/');
    
    }
 
}

    render() {
        return (
            <div style={{ textAlign:'center', marginTop:'12%' }}>
 

                <h2 style={{ marginLeft:50 }}>Login</h2>

                <div style={styles.login}>

                    <Formik
                        initialValues={{
                            username: '',
                            password: ''
                        }}
                        validationSchema={Yup.object().shape({
                            username: Yup.string().required(<h6 style={{ color: '#da542e', fontSize:'80%', display:'block', fontWeight:'500' }}>
                                                                Username is required
                                                            </h6>),
                            password: Yup.string().required(<h6 style={{ color: '#da542e', fontSize: '80%', display: 'block', fontWeight: '500' }}>
                                                                Password is required
                                                            </h6>)
                        })}
                        onSubmit={({ username, password }, { setStatus, setSubmitting }) => {
                            setStatus();
                            authenticationService.login(username, password)
                                .then(
                                    user => {
                                        
                                        const { from } = window.location.reload(true) || { from: { pathname: "/" } };
                                        this.props.history.push(from);
                                    },
                                    error => {
                                        setSubmitting(false);
                                        setStatus(error);
                                    }
                                );
                        }}
                        render={({ errors, status, touched, isSubmitting }) => (
                            <Form >
                                <div className="form-label-group" style={styles.user}>
                                    <label htmlFor="username" style={{ marginRight: 10, marginTop:5 }}>Username</label>
                                    <div style={styles.userField}>
                                        <Field style={{ boxShadow: '2px 2px #b5b5b5' }} name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                        <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                    </div>

                                </div>
                                <div className="form-label-group" style={styles.password}>
                                    <label htmlFor="password" style={{ marginRight: 10, marginTop: 5 }}>Password</label>
                                    <div style={styles.passwordField}>
                                        <Field style={{ boxShadow: '2px 2px #b5b5b5' }} name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                        <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                    </div>

                                </div>
                                <div style={styles.buttonDiv} className="form-group">
                                    <button style={styles.button} type="submit" className="btn btn-primary" disabled={isSubmitting}>Login</button>
                                </div>
                                {status &&
                                    <div className={'alert alert-danger'}>{status}</div>
                                }
                            </Form>
                        )}
                    />
                </div>

            </div>

        )
    }
}

export default LoginPage

const styles = {
    login: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-around',

    },
    user: {
        display: 'flex',
        flex: 1,
        padding: 12,

    },
    password: {
        display: 'flex',
        flex: 1,
        padding: 12,

    },
    userField: {
        display: 'flex',
        flex: 1, 
        flexDirection: 'column',

    },
    passwordField: {
        display: 'flex',
        flex: 1, 
        flexDirection: 'column',

    },
    buttonDiv: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-around',
    },
    button: {
        display: 'flex',
        paddingLeft: 50,
        paddingRight: 50,
        marginLeft: 80,
    }
}