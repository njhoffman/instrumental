import React from 'react';
import { mount, shallow } from 'enzyme';
import HeaderLeft from 'components/Header/HeaderLeft';

describe('Components', () => {
  describe('Header', () => {
    describe('Left', () => {
      it('Should render shallow', () => {
        const wrapper = shallow(<HeaderLeft />);
      });
    });
  });
});
