import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const childrenMonitorState = (props, state, action) => {
  return props.children.map(child => child.type.update(child.props, state, action));
};

const reducer = (props, state = {}, action) => {
  return {
    childrenMonitorState: childrenMonitorState(props, state.childMonitorState, action)
  };
};

const baseStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#1d1d1d'
};

const rowStyles = [{
  width: '100%',
  flexDirection: 'row',
  display: 'flex',
  height: '55px',
  alignItems: 'center'
}, {
  width: '100%',
  flexDirection: 'row',
  display: 'flex',
  height: 'calc(100% - 55px)'
}, {
  display: 'none',
  width: '100%'
}];

const cellStyle = {
  width: '100%'
};

const monitorStyles = [{
  width: '235px',
  height: '100%'
}, {
  height: '100%',
  width: 'calc(100% - 235px)'
}, {
  width: '100%'
}, {
  width: '100%'
}];

class MultipleMonitors extends Component {
  static update = reducer;

  static propTypes = {
    monitorState:        PropTypes.object,
    changeMonitorKey:    PropTypes.string,
    changePositionKey:   PropTypes.string,
    defaultPosition:     PropTypes.string,
    defaultSize:         PropTypes.number,
    toggleVisibilityKey: PropTypes.string,
    children:            PropTypes.array.isRequired,
    style:               PropTypes.object
  };

  render() {
    /* eslint-disable no-unused-vars */
    const {
      monitorState, children, style = baseStyle, changeMonitorKey, changePositionKey,
      defaultPosition, defaultSize, toggleVisibilityKey, ...props
    } = this.props;
    /* eslint-enable no-unused-vars */

    const monitors = [];
    children.forEach(c => c.props.inline && _.isArray(_.last(monitors))
      ? _.last(monitors).push(c)
      : monitors.push([c])
    );

    let n = -1;
    const monitorsRendered = monitors.map((row, i) =>
      <div className={'row-' + i} key={'row-' + i} style={{ ...rowStyles[i] }}>
        {row.map((child, j) => {
          n++;
          return (
            <div
              className={'monitor-' + n}
              key={'cell-' + j}
              style={{ ...cellStyle, ...monitorStyles[n] }}>
              {cloneElement(child, {
                ...props,
                monitorState: monitorState.childrenMonitorState[n],
                key: 'monitor-' + n
              })}
            </div>
          );
        })}
      </div>
    );

    return (
      <div style={style}>
        {monitorsRendered}
      </div>
    );
  }
}

export default MultipleMonitors;
