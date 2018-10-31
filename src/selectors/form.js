import { createSelector } from 'reselect';
import { cloneDeep } from 'lodash';
import { difference } from 'utils/app';

const initialValuesSelector = (form = {}) => cloneDeep(form.initial);
const currentValuesSelector = (form = {}) => cloneDeep(form.values);

const changedFieldsSelector = (initial, current) => (
  difference(cloneDeep(initial), cloneDeep(current))
);

export const changedFields = createSelector(
  initialValuesSelector,
  currentValuesSelector,
  changedFieldsSelector
);

export default changedFields;
