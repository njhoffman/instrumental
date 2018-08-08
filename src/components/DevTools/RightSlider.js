import React from 'react';
import PropTypes from 'prop-types';

const RightSlider = ({ styling, shown, children, rotate }) => (
  <div {...styling([
    'rightSlider',
    shown ? 'rightSliderShown' : null,
    rotate ? 'rightSliderRotate' : null,
    rotate && shown ? 'rightSliderRotateShown' : null
  ])}>
  {children}
</div>
);

RightSlider.propTypes = {
  styling:  PropTypes.object,
  shown:    PropTypes.bool,
  rotate:   PropTypes.bool,
  children: PropTypes.array
};

export default RightSlider;
