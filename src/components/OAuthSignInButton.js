import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ButtonLoader from './ButtonLoader';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import { oAuthSignIn as _oAuthSignIn } from 'redux-auth';

// hook for rewire
var oAuthSignIn = _oAuthSignIn;

export class OAuthSignInButton extends React.Component {
  static propTypes = {
    provider:     PropTypes.string.isRequired,
    endpoint:     PropTypes.string,
    auth:         PropTypes.object.isRequired,
    className:    PropTypes.string,
    label:        PropTypes.string,
    signInParams: PropTypes.object,
    children:     PropTypes.node,
    icon:         PropTypes.func,
    next:         PropTypes.func,
    dispatch:     PropTypes.func
  };

  static defaultProps = {
    signInParams: {},
    children: <span>OAuth Sign In</span>,
    icon: ActionExitToApp
  };

  getEndpoint() {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(['configure', 'currentEndpointKey']) ||
      this.props.auth.getIn(['configure', 'defaultEndpointKey'])
    );
  }

  handleClick() {
    this.props.dispatch(oAuthSignIn({
      provider: this.props.provider,
      params: this.props.signInParams,
      endpointKey: this.getEndpoint()
    }))
      .then(this.props.next)
      .catch(() => {});
  }

  render() {
    let disabled = this.props.auth.getIn(['user', 'isSignedIn']);
    let loading = (
      (this.props.auth.getIn(['ui', 'oAuthSignInLoadingProvider']) === this.props.provider) &&
      this.props.auth.getIn(['oAuthSignIn', this.getEndpoint(), 'loading'])
    );

    return (
      <ButtonLoader
        loading={loading}
        icon={this.props.icon}
        className={this.props.className + ' oauth-sign-in-submit'}
        disabled={disabled}
        onClick={this.handleClick.bind(this)}
        {...this.props} />
    );
  }
}

export default connect(({ auth }) => ({ auth }))(OAuthSignInButton);
