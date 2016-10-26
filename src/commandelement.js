import {isDefined,isUndefined,isString,isObject,isArray,isFunction,enumerate,extend} from './utils';

export function CommandElement(element, event, commandName, fn, context, config) {
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
    }

    this.unbind = function () {
        enumerate(self.events, function (ev) {
            element.removeEventListener(ev, executeCommand);
        });
    }

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
