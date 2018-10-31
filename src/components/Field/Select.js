import React from 'react';
import PropTypes from 'prop-types';
import { Select, InputLabel, FormControl, MenuItem } from '@material-ui/core';
import createComponent from './createFormField';
import mapError from './mapError';

const generateMenu = (dataSource) => {
  const items = [
    <MenuItem key={-1} value='' disabled>Select...</MenuItem>
  ];
  const isArray = Array.isArray(dataSource);
  // assign value to key if dataSource is an object, otherwise assign scalar value
  Object.keys(dataSource).forEach(key => {
    items.push(
      <MenuItem
        value={isArray ? dataSource[key] : key}
        key={isArray ? dataSource[key] : key}>
        {dataSource[key]}
      </MenuItem>
    );
  });
  return items;
};

const SelectForm = createComponent(Select, ({
  input: { onChange, value, onBlur, ...inputProps },
  onChange: onChangeFromField,
  defaultValue,
  ...props
}) => ({
  ...mapError({ ...props, hasHelperText: false }),
  ...inputProps,
  value,
  onChange: event => {
    onChange(event.target.value);
    if (onChangeFromField) {
      onChangeFromField(event.target.value);
    }
  },
  onBlur: () => onBlur(value)
}));

const SelectField = ({
  label,
  options,
  variant,
  initialValues,
  ...props
}) => (
  <FormControl style={{ minWidth: '120px' }}>
    <InputLabel shrink>
      {label}
    </InputLabel>
    <SelectForm {...props} displayEmpty>
      {options && generateMenu(options)}
    </SelectForm>
  </FormControl>
);

SelectField.defaultProps = {
  label: ''
};

SelectField.propTypes = {
  options: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired, // can be object or array
  label: PropTypes.string
};

export { SelectForm };
export default SelectField;
