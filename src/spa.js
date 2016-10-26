import {isDefined,isUndefined,isString,isObject,isArray,isFunction,enumerate,extend} from './utils';
import {CommandElement} from './commandelement';
import {Command} from './command';


function getExceptElements(exceptSelectors) {
    var exceptElements = [];
    for (var i = 0; i < exceptSelectors.length; i++) {
        var elements = document.querySelectorAll(exceptSelectors[i]);
        if (elements) exceptElements = exceptElements.concat(Array.prototype.slice.call(elements));
    }
    return exceptElements;
}

function isInExceptScope(element, exceptElements) {
    console.log(exceptElements);
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
        if (isString(config.scope)) self.scope = document.querySelector(config.scope);
        else if (isObject(config.scope)) self.scope = config.scope;
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
                if(events.length> 0) commandElements.push(new CommandElement(element, events.join(" "), commandName, fn, context, config));
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
        console.log(commands);
        return commands;
    }

    return {
        bindCommand: bindCommand,
        bindCommands: bindCommands
    }

})();


export default {
    binder : binder,
    version : "0.1.0"
};
