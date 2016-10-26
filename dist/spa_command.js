/*!
 * Spa Command v0.1.1
 * (c) 2016 Romagny13
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.spa = factory();
}(this, function () { 'use strict';

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    function isDefined(value) {
        return typeof value !== 'undefined';
    }

    function isString(value) {
        return typeof value === 'string';
    }

    function isObject(value) {
        return value !== null && typeof value === 'object';
    }

    function isFunction(value) {
        return typeof value === 'function';
    }

    var isArray = Array.isArray;
    function extend(source, target) {
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

    function enumerate(elements, callback) {
        for (var i = 0; i < elements.length; i++) callback(elements[i], i);
    }

    function Command(commandElements) {
        var self = this;

        this.commandElements = commandElements;

        this.bind = function () {
            enumerate(commandElements, function (element) {
                element.bind();
            });
        };

        this.unbind = function () {
            enumerate(commandElements, function (element) {
                element.bind();
            });
        };
    }

    function CommandElement(element, event, commandName, fn, context, config) {
        var self = this;

        function executeCommand(e) {
            fn.apply(context, [{
                event: e,
                command: self,
                extra: config.extra
            }]);
        }

        this.bind = function () {
            var events = event.split(" ");
            self.events = events;
            enumerate(self.events, function (ev) {
                element.addEventListener(ev, executeCommand);
            });
        };

        this.unbind = function () {
            enumerate(self.events, function (ev) {
                element.removeEventListener(ev, executeCommand);
            });
        };

        function init() {
            if (isUndefined(element)) throw new Error("Html element required");
            if (isUndefined(event) || event == "") throw new Error("Event required");
            if (isUndefined(commandName)) throw new Error("Command name required");
            if (isUndefined(fn)) throw new Error("Function required");
            if (isUndefined(context)) context = fn;

            self.element = element;
            self.commandName = commandName;
            self.fn = fn;
            self.context = context;

            self.bind();
        }
        init();
    }

    function getExceptElements(exceptSelectors) {
        var exceptElements = [];
        for (var i = 0; i < exceptSelectors.length; i++) {
            var elements = document.querySelectorAll(exceptSelectors[i]);
            if (elements) exceptElements = exceptElements.concat(Array.prototype.slice.call(elements));
        }
        return exceptElements;
    }

    function isInExceptScope(element, exceptElements) {
        for (var i = 0; i < exceptElements.length; i++) {
            if (exceptElements[i].contains(element)) return true;
        }
        return false;
    }

    var binder = (function () {
        var defaults = {
            eventAttribute: "data-event",
            scope: "body"
        };

        function bindCommand(commandName, fn, config) {
            if (isUndefined(commandName)) throw new Error("Command name required");
            if (isUndefined(fn) || !isFunction(fn)) throw new Error("Function required");
            if (isUndefined(config)) config = {};
            var context = isDefined(config.context) ? config.context : fn;
            if (isDefined(config.except) && !isArray(config.except)) throw new Error("Except require an array of selectors");

            extend(defaults, config);

            // scope
            if (isString(config.scope)) self.scope = document.querySelector(config.scope);else if (isObject(config.scope)) self.scope = config.scope;
            if (!self.scope) throw new Error("No element found for scope");

            // elements
            var hasExceptedScopes = false,
                exceptElements;
            if (isDefined(config.except)) {
                var hasExceptedScopes = true;
                exceptElements = getExceptElements(config.except);
            }
            var commandElements = [];
            var eventAttribute = config.eventAttribute;
            var elements = scope.querySelectorAll('[' + eventAttribute + '*="' + commandName + '"]');
            enumerate(elements, function (element, index) {
                if (!hasExceptedScopes || !isInExceptScope(element, exceptElements)) {
                    var attributeValue = element.getAttribute(eventAttribute);
                    var commandsSplits = attributeValue.split(";");
                    // A command could have multiples event name:
                    // data-event="click:mycommand;keypress:mycommand"
                    var events = [];
                    enumerate(commandsSplits, function (commandSplit) {
                        var keyValue = commandSplit.split(":");
                        if (keyValue.length != 2) throw new Error("Invalid key value (example data-event=\"click:clickMethod\")");

                        var event = keyValue[0],
                            functionName = keyValue[1];

                        if (functionName == commandName) events.push(event);
                    });
                    // create command with events
                    if (events.length > 0) commandElements.push(new CommandElement(element, events.join(" "), commandName, fn, context, config));
                }
            });
            return new Command(commandElements);
        }

        function bindCommands(obj, config) {
            if (isUndefined(obj) || !isObject(obj)) throw new Error("Object required");
            if (isUndefined(config)) config = {};
            if (isUndefined(config.context)) config.context = obj;

            var commands = {};
            for (var propertyName in obj) {
                var property = obj[propertyName];
                if (isFunction(property)) {
                    var command = bindCommand(propertyName, property, config);
                    if (command.commandElements.length > 0) commands[propertyName] = command;
                }
            }
            return commands;
        }

        return {
            bindCommand: bindCommand,
            bindCommands: bindCommands
        };
    })();

    var spa = {
        binder: binder,
        version: "0.1.1"
    };

    return spa;

}));