import { humanMemorySize } from 'shared/util';
import { init as initLog } from 'shared/logger';
const { debug } = initLog('app');

let lastHeapSize = 0;
export const startMemoryStats = (interval = 10000) => {
  const memoryStats = () => {
    if (window.performance && window.performance.memory) {
      const { totalJSHeapSize, usedJSHeapSize } = window.performance.memory;
      const used = humanMemorySize(usedJSHeapSize, true);
      const total = humanMemorySize(totalJSHeapSize, true);
      if (Math.abs(usedJSHeapSize - lastHeapSize) > 10485760) {
        debug(`-- JS Heap Size: ${used} / ${total}`);
        lastHeapSize = usedJSHeapSize;
      }
    }
  };
  setTimeout(memoryStats, interval);
};

export const domStats = () => {
  let stats = { maxDepth: 0, totalNodes: 0, totalDepth: 0 };
  const getNodeStats = (el, depth) => {
    stats.maxDepth = depth > stats.maxDepth ? depth : stats.maxDepth;
    stats.totalNodes++;
    stats.totalDepth += depth;
    let i;
    for (i = 0; i < el.children.length; i++) {
      getNodeStats(el.children[i], depth + 1);
    }
  };
  getNodeStats(document, 0);
  stats.averageDepth = (stats.totalDepth / stats.totalNodes).toFixed(2);
  debug(`-- depth => ${stats.averageDepth} / ${stats.maxDepth} : ${stats.totalNodes} Nodes`);
};
