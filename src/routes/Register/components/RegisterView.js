import React, { PropTypes } from "react";
import { Row, Column } from 'react-foundation';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Paper } from 'material-ui';
import EmailSignUpForm from './EmailSignUpForm';
import OAuthSignInButton from 'components/OAuthSignInButton'
import css from './RegisterView.scss';
import facebookIcon from 'assets/fb-icon.png';
import googleIcon from 'assets/google-icon.png';


const googleIconComponent =
  <img
    src={googleIcon}
    style={{marginTop: '-10px', maxWidth: '30px', width: '30px', height: '30px' }} />;
const facebookIconComponent =
  <img
    src={facebookIcon}
    style={{marginTop: '-10px', width: '20px', maxWidth: '20px' }} />;

export const RegisterView = (props) => (
  <Column small={8} centerOnSmall={true}>
    <Paper zDepth={5}>
      <div className={css.registerContainer}>
        <h3>Sign Up for Instrumental.com</h3>
        <p>It's free. It's easy. It takes 5 seconds.</p>
        <OAuthSignInButton
          style={{ width: '225px', marginBottom: '10px' }}
          backgroundColor={'#4c69ba'}
          labelColor={'#ffffff'}
          icon={facebookIconComponent}
          provider="facebook">
          Sign Up with Facebook
        </OAuthSignInButton>
        <OAuthSignInButton
          style={{ width: '225px' }}
          backgroundColor={'#4285f4'}
          labelColor={'#ffffff'}
          icon={googleIconComponent}
          provider="google">
          Sign Up With Google
        </OAuthSignInButton>
        <div className={css.divider}>
          <span>or, sign up with email</span>
        </div>
        <EmailSignUpForm next={() => { browserHistory.push('/songs') }}  />
      </div>
    </Paper>
  </Column>
);

export default muiThemeable()(RegisterView);


