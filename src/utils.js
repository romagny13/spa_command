export function isUndefined(value) { return typeof value === 'undefined'; }
export function isDefined(value) { return typeof value !== 'undefined'; }
export function isString(value) { return typeof value === 'string'; }
export function isNumber(value) { return typeof value === 'number'; }
export function isObject(value) { return value !== null && typeof value === 'object'; }
export function isFunction(value) { return typeof value === 'function'; }
export function isBoolean(value) { return typeof value === 'boolean'; }
export function isDate(value) { return toString.call(value) === '[object Date]'; }
export var isArray = Array.isArray;
export function isNumberString(value) {
    return /^-?[0-9]+(\.[0-9]+)?$/.test(value);
}
export function isBooleanString(value) {
    return /^(true|false)$/.test(value);
}

export function extend(source, target) {
    if (typeof source == 'object') {
        for (var property in source) {
            var targetHasProperty = target.hasOwnProperty(property);
            // if target has not the property
            // if target has property , dont change
            if (!targetHasProperty) {
                target[property] = source[property];
            }
        }
    }
    return target;
}

export function enumerate(elements,callback) {
    for (var i = 0; i < elements.length; i++) callback(elements[i],i);
}
