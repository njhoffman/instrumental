import React from 'react';
import { shallow } from 'enzyme';
import RegisterViewConnected, { RegisterView } from 'routes/Register/components/RegisterView';
import EmailSignUpForm from 'routes/Register/components/EmailSignUpForm';
import { OAuthSignInButton } from 'redux-auth/material-ui-theme';

describe('Routes', () => {
  describe('Register', () => {
    describe('Component: RegisterView', () => {
      const handleRegisterSuccess = sinon.stub();
      const props = {
        handleRegisterSuccess
      };
      it('Should renders shallow', () => {
        const wrapper = shallow(<RegisterView {...props} />);
      });

      it('Should contain the proper content wrapping elements', () => {
        const wrapper = shallow(<RegisterView {...props} />);
        expect(wrapper.at(0).name()).to.equal('Column');
        expect(wrapper.childAt(0).name()).to.equal('Paper');
        expect(wrapper.at(0).props()).to.contain.all.keys('small', 'medium', 'large');
      });

      it('Should contain a register button and a forgot password button', () => {
        const wrapper = shallow(<RegisterView {...props} />);
        expect(wrapper.find(OAuthSignInButton)).to.have.length(2);
      });

      it('Should contain EmailSignUpForm component with next prop set to a function', () => {
        const wrapper = shallow(<RegisterView {...props} />);
        expect(wrapper.find(EmailSignUpForm)).to.have.length(1);
      });
    });
  });
});
