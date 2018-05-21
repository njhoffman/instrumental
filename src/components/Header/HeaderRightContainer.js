import { connect } from 'react-redux';

import {
  userDisplay as userDisplaySelector,
  userPoints as userPointsSelector
} from 'selectors/users';

import HeaderRight from './HeaderRight';

const mapActionCreators = { };

const mapStateToProps = (state) => ({
  userDisplayName: userDisplaySelector(state),
  getUserPoints:   userPointsSelector(state),
  isSignedIn: state.user.isSignedIn
});

export default connect(mapStateToProps, mapActionCreators)(HeaderRight);
