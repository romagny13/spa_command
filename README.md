# Spa Command

A simple way to bind commands.

## Installation

```
npm install spa_command --save
```

## Bind a command with a function

```js
spa.binder.bindCommand("mycommand", function (e) {
           
});
```

```html
<button data-event="click:mycommand">My command</button>
```

## Bind a command with an object (object with only commands or a view model for example)

```js
var vm = {
    title: "My title",
    mycommand1: function (e) {
        console.log(this); // context vm
        // access to the context
        this.title = "My new title";
    },
    mycommand2: function (e) {
        console.log("mycomand2",e);
    },
};

spa.binder.bindCommands(vm);
```

```html
 <button data-event="click:mycommand1">My command 1</button>
```

## Multiples events

The command will be raised on "blur" (lost focus) and "keypress" for example

```html
<input type="text" data-event="blur:mycommand2;keypress:mycommand2" />
```

## config

- scope : by default is "body". Could be change by selector (example "#mydiv") or with the html element
- eventAttribute : by default "data-event"
- context : allow to change the context of the command
- except : allow to ignore elements 
- extra : allow to pass extra data

Example:  
all html elements with the class "not-bind" will be ignored.

```js
spa.binder.bindCommands(vm, {
    except: [".not-bind"],
    extra: {
        value: "my value"
    }
});
```



