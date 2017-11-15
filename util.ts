import * as _ from 'lodash';

export function findJsToJsxImport(circularPath: string[]): [string, string] | null {
    for (let i = 0; i < circularPath.length - 1; i++) {
        const current = circularPath[i];
        const next = circularPath[i + 1];
        if (_.endsWith(current, '.js') && _.endsWith(next, '.jsx')) {
            return [current, next];
        }
    }
    return null;
}

export function findSomethingToRouteImport(circularPath: string[]): [string, string] | null {
    for (let i = 0; i < circularPath.length - 1; i++) {
        const current = circularPath[i];
        const next = circularPath[i + 1];
        if (_.includes([
                'frontend/scripts/desktop/redux/modules/search-multi/route.js',
                'frontend/scripts/desktop/redux/modules/car/product/route.js',
                'frontend/scripts/desktop/partner/turbo/routes.js'
            ], next)) {
            return [current, next];
        }
    }
    return null;
}

export function findUtilRouteToFetchImport(circularPath: string[]): [string, string] | null {
    for (let i = 0; i < circularPath.length - 1; i++) {
        const current = circularPath[i];
        const next = circularPath[i + 1];
        if (current === 'frontend/scripts/util/route.js' &&
            next === 'frontend/scripts/common/service/fetch.js') {
            return [current, next];
        }
    }
    return null;
}

export function findUtilPromiseToReduxStoreImport(circularPath: string[]): [string, string] | null {
    for (let i = 0; i < circularPath.length - 1; i++) {
        const current = circularPath[i];
        const next = circularPath[i + 1];
        if (current === 'frontend/scripts/util/promise.js' &&
            next === 'frontend/scripts/desktop/redux/store.js') {
            return [current, next];
        }
    }
    return null;
}