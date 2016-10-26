import {enumerate} from './utils';

export function Command(commandElements) {
    var self = this;

    this.commandElements = commandElements;

    this.bind = function () {
        enumerate(commandElements, function (element) {
            element.bind();
        });
    }

    this.unbind = function () {
        enumerate(commandElements, function (element) {
            element.bind();
        });
    }
}
