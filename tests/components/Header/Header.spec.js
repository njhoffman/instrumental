import React from 'react';
import { mount, shallow } from 'enzyme';
import Header from 'components/Header';

describe('Components', () => {
  describe('Header', () => {
    it('Should render shallow', () => {
      const wrapper = shallow(<Header />);
    });
  });
});
