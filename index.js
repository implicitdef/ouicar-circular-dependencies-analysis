const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const Util = require('./util');

console.log('**** Circular dependencies analysis ****');

const file = path.resolve(process.env.OUICAR_WEB_PATH, 'logs/webpack.errors.log');
console.log(`Reading file ${file}`);
const fileContent = fs.readFileSync(file, 'utf-8');

const circularPaths = JSON.parse(fileContent)
    .errors
    .filter(err => err.type === 'circular')
    .map(err => err.msg.split('->'));

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
        const shortenedVersion = circularPath
            .map(filePath => filePath.slice(-20))
            .map(filePath => '...' + filePath)
            .join('->')
            .slice(0, 100) + '...';
        return `other : ${shortenedVersion}`;
    })
    //.filter(Array.isArray)
    .sort()
    //.map(circularPath => circularPath as string[])
    .forEach(circularPath => console.log(circularPath));


