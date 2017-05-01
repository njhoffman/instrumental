const pjson = require('prettyjson-256');
const _ = require('lodash');
let allSubsystems = [];

const pjsonOptions = {
  colors:     {
    keys:    { fg:  [0, 2, 1] },
    number:  { grayscale: 11 }
  },
  customColors : {
    bold:                     { grayscale: 23 },
    blue:                     { fg: [0, 0, 4] },
    lightBlue:                { fg: [0, 1, 5] },
    darkBlue:                 { fg: [0, 0, 3] },
    red:                      { fg: [3, 0, 0] },
    lightRed:                 { fg: [5, 0, 0] },
    darkRed:                  { fg: [1, 0, 0] },
    green:                    { fg: [0, 3, 0] },
    lightGreen:               { fg: [0, 5, 0] },
    darkGreen:                { fg: [0, 1, 0] },
    purple:                   { fg: [1, 0, 3] },
    lightPurple:              { fg: [2, 0, 5] },
    darkPurple:               { fg: [1, 0, 1] },
    cyan:                     { fg: [2, 3, 4] },
    lightCyan:                { fg: [2, 5, 5] },
    darkCyan:                 { fg: [1, 2, 3] },
    yellow:                   { fg: [4, 5, 0] },
    orange:                   { fg: [5, 2, 0] },
    white:                    { fg: [0, 3, 0] },
    gray:                     { grayscale: 12 },

    error:                    { fg: [4, 0, 0] },
    warn:                     { fg: [4, 2, 2] },
    log:                      { fg: [0, 2, 4] },
    info:                     { fg: [2, 2, 4] },
    trace:                    { fg: [3, 3, 4] },
    responseGet:              { fg: [1, 4, 3] },
    requestGet:               { fg: [1, 4, 3] },
    requestDelete:            { fg: [4, 1, 1] },
    requestPost:              { fg: [1, 2, 4] },
    requestOther:             { fg: [1, 3, 3] },
    requestUrl:               { fg: [4, 4, 4] },
    requestStatusError:       { fg: [4, 0, 0] },
    requestStatusWarn:        { fg: [4, 2, 1] },
    requestStatusInfo:        { fg: [0, 2, 4] },
    requestStatusOk:          { fg: [0, 3, 0] },
    webpackMemoryLabel:       { fg: [1, 2, 4] },
    webpackMemoryValue:       { fg: [4, 2, 1] },
    webpackDetailMemoryValue: { fg: [5, 5, 5] }
  },
  alphKeys:   true,
  alphArrays: true
};

const render = pjson.render.bind(undefined, pjsonOptions);

// TODO: override with DEBUG environment variables
const findLevel = (subsystems, conf, depth, level) => {
  const curr = subsystems.slice(0, depth);
  const next = subsystems.length > depth ? subsystems.slice(0, depth + 1) : null;
  if (_.has(conf, curr)) {
    if (typeof _.get(conf, curr) === 'number') {
      return _.get(conf, curr);
    } else if (subsystems.length + 1 > depth && _.has(conf, next)) {
      level = findLevel(subsystems, conf, ++depth, level);
    } else if (typeof _.get(conf, curr.concat('*')) === 'number') {
      return level;
    }
  }
  return level;
};

const debug = (level, subsystem, ...messages) => {
  const conf = require('./config.js');
  const confLevel = findLevel(subsystem.split(':'), conf, 1, 5);
  if (level > confLevel) {
    return;
  }
  const subsystemsLength = _.maxBy(allSubsystems, (ss) => ss.length).length + 1;
  const subObj = level === 0
    ? { fatal: subsystem }
    : level === 1
    ? { error: subsystem }
    : level === 2
    ? { warn: subsystem }
    : level === 4
    ? { info: subsystem }
    : level === 5
    ? { trace: subsystem }
    : { log: subsystem };

  let out = '  ' + render(subObj);
  for (var i = 0; i < messages.length; i++) {
    let message = messages[i];
    if (_.isObject(message)) {
      out += '\n' + render(message, subsystemsLength + 7);
    } else {
      // check for special color directive
      // TODO: output warning if color directive found but no color match
      if (/%.*%/.test(message) &&
        _.isObject(messages[i + 1]) &&
        messages[i + 1]['color']) {
        i++;
        message.match(/(%.*?%)/g).forEach(customMessage => {
          const colorKey = messages[i]['color'] &&
            pjsonOptions.customColors[messages[i]['color']]
            ? messages[i]['color'] : false;
          if (colorKey) {
            let renderObj = {};
            renderObj[colorKey] = customMessage.replace(/%/g, '');
            message = message.replace(customMessage, render(renderObj));
            i++;
          } else {
            out += '\n -- debugger cant find color code: ' + messages[i]['color'];
          }
        });
        out += Array(subsystemsLength - subsystem.length).join(' ') + '   ' + message;
      } else if (i === 0) {
        out += Array(subsystemsLength - subsystem.length).join(' ') + '   ' + render(message);
      } else {
        out += '\n' + Array(subsystemsLength + 7).join(' ') + render(message);
      }
    }
  }
  console.log(out);
};

module.exports = (subsystem) => {
  allSubsystems.push(subsystem);
  return {
    fatal: debug.bind(undefined, 0, subsystem),
    error: debug.bind(undefined, 1, subsystem),
    warn:  debug.bind(undefined, 2, subsystem),
    log:   debug.bind(undefined, 3, subsystem),
    info:  debug.bind(undefined, 4, subsystem),
    trace: debug.bind(undefined, 5, subsystem)
  };
};