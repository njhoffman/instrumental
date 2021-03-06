const pjson = require('prettyjson-256');
const _ = require('lodash');

const beautifiers = require('./browser.beautifiers');

//  console.log('%cBlue! %cRed!', 'color: blue;', 'color: red;');
pjson.init({ browser: true, showEmpty: false });
const subsystems = ['hot-module'];
const lineLimit = 170;
const logDelay = 100;

/* eslint-disable no-console */
const consoleLog = console.log;
const consoleGroupCollapsed = console.groupCollapsed;
const consoleGroupEnd = console.groupEnd;
/* eslint-enable no-console */


// TODO : work on client side parsing with prettyjson-256, chokes on undefined items
const removeEmpty = (obj) => {
  if (!_.isObject(obj)) {
    return obj;
  }

  Object.keys(obj).forEach(key => {
    const curr = obj[key];
    if (curr && _.isObject(curr)) {
      removeEmpty(curr);
    } else if (curr === undefined || curr === null) {
      /* eslint-disable no-param-reassign */
      delete obj[key];
      /* eslint-enable no-param-reassign */
    }
  });


  return obj;
};

const createLogLine = (messages) => {
  let out = '';
  const colors = [];
  let lineLength = 0;
  messages.forEach((line, n) => {
    const newMessage = line[0].replace(/%i$/, '');
    const newMessageLength = newMessage.replace(/%c/g, '').length;
    if (n > 0 && !/%i$/.test(line[0])) {
      out += ' \n ';
      lineLength = 0;
    }
    lineLength += newMessageLength;
    out += lineLength > lineLimit
      ? `${newMessage.slice(0, lineLimit - (lineLength - newMessageLength))}...`
      : newMessage;
    colors.push(...line.slice(1));
    const nextLine = messages[n + 1];
    if (nextLine && !/%i$/.test(nextLine[0])) {
      out += ' \r ';
    }
  });
  return [out, ...colors];
};

let firstLog = null;
const parseLog = (subsystem, style, options, messages) => {
  // delay initial message so grouped messages form properly
  if (!firstLog) {
    firstLog = new Date().getTime();
  }
  const logWait = new Date().getTime() - firstLog;
  if (logWait < logDelay) {
    setTimeout(() => parseLog(subsystem, style, options, messages), (logDelay - logWait));
  } else {
    if (subsystems.indexOf(subsystem) === -1) {
      subsystems.push(subsystem);
    }
    const ssLength = 6 + _.maxBy(subsystems, (ss) => ss.length).length - subsystem.length;

    let action = false;
    let toProcess = messages;

    if (_.isArray(messages)) {
      const lastKey = _.isObject(_.last(messages)) && _.keys(_.last(messages)).length === 1
        ? _.keys(_.last(messages))[0] : false;

      if (lastKey && _.has(beautifiers, lastKey)) {
        const lastMessage = messages.pop();
        const pretty = beautifiers[lastKey](lastMessage[lastKey]);
        toProcess = _.isArray(pretty) && _.isArray(pretty[0]) ? pretty : [pretty];
        action = lastKey === '_action' && lastMessage._action;
      } else {
        toProcess = messages.filter((msg) => !_.isUndefined(msg));
      }
    }

    const logMessages = [];
    [].concat(toProcess)
      .filter((msg) => !_.isEmpty(msg))
      .forEach((message, i) => {
        const msg = removeEmpty(_.cloneDeep(message));
        let rendered = [];
        if (_.isArray(msg) && msg[0].split('%c').length === msg.length) {
          // if has own color code formatting, don't send it through json parser
          const tmp = pjson.render(msg.shift());
          rendered.push([tmp[0], tmp[1][0]].concat(msg));
        } else {
          // parser returns rendered messages in first array, colors in second
          const indent = i > 0 ? ssLength + subsystem.length + ((i + 1) * 3) : 0;
          rendered = pjson.render(msg, indent);
          rendered = _.zip(rendered[0], rendered[1]);
        }

        // add subsystem to first line
        if (i === 0) {
          rendered[0][0] += '%i';
          rendered.unshift([
            `%c ${subsystem} ${Array(ssLength).join(' ')}`,
            style
          ]);
        }
        const logLine = createLogLine(rendered);
        logMessages.push(logLine);
      });

    if (action && _.isObject(action.payload) && options.logActions) {
      // console.log(`${grouped}: ${lastDelay}`);
      const [msg, ...colors] = logMessages[0];
      const groupLine = [msg, colors];
      consoleGroupCollapsed(groupLine[0], ...groupLine[1]);

      consoleGroupCollapsed(`payload (${_.keys(action.payload).length} keys)`);
      _.keys(action.payload).forEach(pKey => {
        if (!_.isObject(action.payload[pKey])) {
          consoleLog({ [pKey]: action.payload[pKey] });
        } else {
          consoleLog(pKey, action.payload[pKey]);
        }
      });
      consoleGroupEnd();

      if (action.meta) {
        consoleGroupCollapsed(`meta (${_.keys(action.meta).length} keys)`);
        _.keys(action.meta).forEach(mKey => {
          if (!_.isObject(action.meta[mKey])) {
            consoleLog({ [mKey]: action.meta[mKey] });
          } else {
            consoleLog(mKey, action.meta[mKey]);
          }
        });
        consoleGroupEnd();
      }
      consoleGroupEnd();
    } else {
      logMessages.forEach(([msg, ...colors]) => msg.split('\n').forEach(
        (line) => consoleLog(line, ...colors.splice(0, line.split('%c').length - 1))
      ));
    }
  }
};

/* eslint-disable no-console */
console.log = function consoleLogEnhanced(...args) {
  if (args[0] && args[0].indexOf && args[0].indexOf('[HMR]') !== -1) {
    if (args[0].indexOf('bundle rebuilding') !== -1) {
      // console.clear();
    }
    return parseLog('hot-module', 'color: #ff8800', {}, `${args[0]}`);
  }
  return consoleLog.apply(console, args);
};
/* eslint-enable no-console */

module.exports = {
  parseLog
};
