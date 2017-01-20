import React, { PropTypes } from "react";
import ContentSend from "material-ui/svg-icons/content/send";
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import muiThemeable from 'material-ui/styles/muiThemeable';

import { MdHelp as HelpIcon } from 'react-icons/lib/md';

import { RaisedButton } from 'material-ui';
import ButtonLoader from 'components/ButtonLoader';
import { RenderTextField } from 'components/Field';
import { emailSignUp } from 'store/auth/actions/email-sign-up';
import css from './EmailSignUpForm.scss';

class EmailSignUpForm extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    next: PropTypes.func,
    emailSignUp: PropTypes.func,
    inputProps: PropTypes.shape({
      email: PropTypes.object,
      password: PropTypes.object,
      passwordConfirmation: PropTypes.object,
      submit: PropTypes.object
    })
  };

  static defaultProps = {
    next: () => {},
    inputProps: {
      email: {},
      password: {},
      submit: {}
    }
  };

  getEndpoint () {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(["configure", "currentEndpointKey"]) ||
      this.props.auth.getIn(["configure", "defaultEndpointKey"])
    );
  }

  handleSubmit (event) {
    console.log("@-->handling submit");
    event.preventDefault();

    let formData = this.props.registerForm.values;
    this.props.dispatch(this.props.emailSignUp(formData, this.getEndpoint()))
      .then(this.props.next)
      .catch(() => {});
  }

  render () {
    let disabled = (
      this.props.auth.getIn(["user", "isSignedIn"]) ||
      this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "loading"])
    );

    const errors = this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors"]);

    return (
      <form className='redux-auth email-sign-up-form clearfix'
        style={{clear: "both", overflow: "hidden"}}
        onSubmit={this.handleSubmit.bind(this)}>
        <div>
          { errors && errors.map(error =>
            <p>{error}</p>
          )}
        </div>
        <div className={css.fieldWrapper}>
          <Field
            component={RenderTextField}
            label="Email"
            name="email-sign-up-email"
            disabled={disabled}
          />
        </div>
        <div className={css.fieldWrapper}>
          <Field type="password"
            component={RenderTextField}
            label="Password"
            name="email-sign-up-password"
            disabled={disabled}
            {...this.props.inputProps.password} />
        </div>
        <div className={css.fieldWrapper}>
          <Field type="password"
            component={RenderTextField}
            label="Password Confirmation"
            name="email-sign-up-password-confirmation"
            disabled={disabled}
            {...this.props.inputProps.passwordConfirmation} />
        </div>
        <div className={css.buttonWrapper}>
          <RaisedButton
            label="Reset Password"
            style={{ marginRight: "10px" }}
            icon={<HelpIcon />}
          />
          <ButtonLoader
            loading={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "loading"])}
            type="submit"
            name="email-sign-up-submit"
            primary={true}
            icon={ContentSend}
            disabled={disabled}
            onClick={this.handleSubmit.bind(this)}
            {...this.props.inputProps.submit}>
            Sign Up
          </ButtonLoader>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    registerForm: state.form.register,
    emailSignUp: emailSignUp
  };
}

export default connect(mapStateToProps)( muiThemeable()(reduxForm({ form: 'register' })(EmailSignUpForm)) );
