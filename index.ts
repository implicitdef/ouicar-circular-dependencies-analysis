import * as fs from 'fs';
import * as _ from 'lodash';
import * as Util from './util';
import * as path from 'path';

console.log('**** Circular dependencies analysis ****');

const file = path.resolve(process.env.OUICAR_WEB_PATH, 'logs/webpack.errors.log');
console.log(`Reading file ${file}`);
const lines = fs.readFileSync(file, 'utf-8').split('\n');

const circularPaths = lines
    // keep only circular dependencies error 
    .filter(line => line.indexOf('Circular dependency') !== -1)
    // remove the ones involving node_modules
    .filter(line => line.indexOf('node_modules/') === -1)
    // remove some color stuff, appears in some cases
    .map(line => line.replace('\u001b[1m\u001b[31m', ''))
    .map(line => line.replace('\u001b[39m\u001b[22m', ''))
    // clean up the beginning of the line
    .map(line => line.replace(/- \d+: Circular dependency : /, ''))
    .map(line => line.split('->'));

console.log(`We got ${circularPaths.length} circular paths`);

circularPaths
    .map(circularPath => {
        // because of deposit.js and the steps constant
        if (_.includes(circularPath, 'frontend/scripts/common/service/deposit.js')) {
            return 'DEPOSIT_JS'
        }
        // if something to route
        const somethingToRoute = Util.findSomethingToRouteImport(circularPath);
        if (somethingToRoute) {
            return `SOMETHING_TO_ROUTE : ${somethingToRoute[0]} => ${somethingToRoute[1]}`
        }
        // if js to jsx
        const jsToJsx = Util.findJsToJsxImport(circularPath);
        if (jsToJsx) {
            return `JS_TO_JSX : ${jsToJsx[0]} => ${jsToJsx[1]}`
        }
        // if something to route
        const utilRouteToFetch = Util.findUtilRouteToFetchImport(circularPath);
        if (utilRouteToFetch) {
            return `UTIL_ROUTE_TO_FETCH`
        }
        // if something to route
        const utilPromiseToReduxStore = Util.findUtilPromiseToReduxStoreImport(circularPath);
        if (utilPromiseToReduxStore) {
            return `UTIL_PROMISE_TO_REDUX_STORE`
        }
        // all other
        return 'other';
    })
    //.filter(Array.isArray)
    .sort()
    //.map(circularPath => circularPath as string[])
    .forEach(circularPath => console.log(circularPath));


