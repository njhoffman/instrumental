import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Drawer,
  Divider,
  MenuItem,
  withStyles,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';

import facebookIcon from 'assets/fb-icon.png';
import googleIcon from 'assets/google-icon.png';
import { Email as EmailIcon, Lock as SignOutIcon } from '@material-ui/icons';

import { uiHideDrawerMenu } from 'actions/ui';

import DrawerMenuLink from './DrawerMenuLink';
import css from './DrawerMenu.scss';

const GoogleIcon = () => (<img src={googleIcon} style={{ height: '1.75em' }} />);
const FacebookIcon = () => (<img src={facebookIcon} style={{ height: '1.25em'}} />);

const styles = (/* theme */) => ({
  buttonLink: {
    width: 'calc(100% - 6px)',
    margin: '3px'
  }
});

const SignedOut = ({ isOpen, hideDrawerMenu }) => (
  <Drawer open={isOpen} onClose={hideDrawerMenu}>
    <DrawerMenuLink link='/' label='Home' />
    <DrawerMenuLink link='/register' label='Register' />
    <DrawerMenuLink link='/reset' label='Reset' />
    <DrawerMenuLink link='/contact' label='Contact' />
    <Divider />
    <MenuItem>
      <ListItemIcon>
        <FacebookIcon />
      </ListItemIcon>
      <ListItemText inset primary='Facebook Sign In' />
    </MenuItem>
    <MenuItem>
      <ListItemIcon>
        <GoogleIcon />
      </ListItemIcon>
      <ListItemText inset primary='Google Sign In' />
    </MenuItem>
    <MenuItem>
      <ListItemIcon>
        <EmailIcon />
      </ListItemIcon>
      <ListItemText inset primary='Email Sign In' />
    </MenuItem>
  </Drawer>
);

SignedOut.propTypes = {
  hideDrawerMenu : PropTypes.func.isRequired,
  isOpen         : PropTypes.bool.isRequired
};


const SignedIn = ({ hideDrawerMenu, isOpen }) => (
  <Drawer open={isOpen} onClose={hideDrawerMenu}>
    <DrawerMenuLink link='/' label='Home' />
    <DrawerMenuLink link='/songs' label='Songs' />
    <DrawerMenuLink link='/profile' label='Profile' />
    <DrawerMenuLink link='/stats' label='Stats' />
    <DrawerMenuLink link='/settings' label='Settings' />
    <DrawerMenuLink link='/fields' label='Fields' />
    <Divider />
    <MenuItem>
      <ListItemIcon>
        <SignOutIcon />
      </ListItemIcon>
      <ListItemText inset primary='SIGN OUT' />
    </MenuItem>
  </Drawer>
);

SignedIn.propTypes = {
  hideDrawerMenu : PropTypes.func.isRequired,
  isOpen         : PropTypes.bool.isRequired
};


const DrawerMenu = ({
  isSignedIn,
  ...props
}) => (
  <div className={css.drawerMenuContainer}>
    {isSignedIn && SignedIn(props)}
    {!isSignedIn && SignedOut(props)}
  </div>
);

DrawerMenu.propTypes = {
  isSignedIn     : PropTypes.bool.isRequired
};

const mapDispatchToProps = {
  hideDrawerMenu : uiHideDrawerMenu
};

const mapStateToProps = (state) => ({
  isOpen: state.ui.drawer.isOpen,
  isSignedIn: state.user.isSignedIn
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DrawerMenu));
