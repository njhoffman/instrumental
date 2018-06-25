import React  from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import ActionLock from 'material-ui-icons/Lock';
import { connect } from 'react-redux';
import { signOut } from 'actions/auth';

export class SignOutButton extends React.Component {
  static propTypes = {
    next:     PropTypes.func.isRequired,
    endpoint: PropTypes.string,
    icon:     PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    auth:     PropTypes.object.isRequired,
    user:     PropTypes.object.isRequired
  };

  static defaultProps = {
    next: () => {}
  };

  getEndpoint() {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(['configure', 'currentEndpointKey']) ||
      this.props.auth.getIn(['configure', 'defaultEndpointKey'])
    );
  }

  handleClick() {
    this.props.dispatch(signOut(this.getEndpoint()))
      .then(this.props.next)
      .catch(() => {});
  }

  render() {
    let disabled = !this.props.user.isSignedIn;
    return (
      <Button
        icon={ActionLock}
        disabled={disabled}
        label='Sign Out'
        primary
        className='sign-out-submit'
        onClick={() => this.handleClick()}
        {...this.props} />

    );
  }
}

export default connect(({ auth, user }) => ({ auth, user }))(SignOutButton);
