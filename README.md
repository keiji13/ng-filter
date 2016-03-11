Angular filter and custom filter
====
Angular filters can be used to transform data

Some buit-in filters in angular
---

`currency` *Format a number to a currency format.*

`filter` *Select a subset of items from an array.*

`lowercase` *Format a string to lower case.*

`orderBy` *Orders an array by an expression.*

`uppercase` *Format a string to upper case.*

Single use filter
----
Single use filter just filters a single piece of Model data (not a loop or anything fancy) and spits it out into the View for us. This could be something like a date:
```
<p>{{ 1400956671914 | date: 'dd-MM-yyyy' }}</p>
```
When rendered, the DOM would look like this:
```
<p>24-05-2014</p>
```
Creating custom filter
---
Angular has a `.filter()` method for each Module, which means we can write our own custom filters. Let's look at a stripped down filter:
```
angularModule.filter('', function () {
  return function () {
    return;
  };
});
```
> The returned function gets invoked each time Angular calls the filter, which means two-way binding for our filters. 

> The user makes a change, the filter runs again and updates as necessary. 

> The name of our filter is how we can reference it inside Angular bindings.

Filters for repeats
---
Filters are really handy for iterating over data and without much more work, we can do exactly that.

The syntax is quite similar when filtering a repeat, let's take some example data:
```
angularModule.controller('PersonCtrl', function () {
  this.friends = [{
    name: 'Andrew'        
  }, {
    name: 'Will'
  }, {
    name: 'Mark'
  }, {
    name: 'Alice'
  }, {
    name: 'Todd'
  }];
});
```
We can setup a normal `ng-repeat` on it:
```
<ul>
  <li ng-repeat="friend in person.friends">
    {{ friend }}
  </li>
</ul>
```
Renders as:
```
• {"name":"Andrew"}
• {"name":"Will"}
• {"name":"Mark"}
• {"name":"Alice"}
• {"name":"Todd"}
```
Filter friends name starting with character 'A'
---
```
// filter.js

angularModule.filter('startsWithA', function () {
  return function (items) {
    return items.filter(function (item) {
      return /a/i.test(item.name.substring(0, 1));
    });
  };
});

// template.html

<ul>
  <li ng-repeat="friend in person.friends | startsWithA">
    {{ friend }}
  </li>
</ul>
```
Renders as:
```
• {"name":"Andrew"}
• {"name":"Alice"}
```
Filter friends name starting with dynamic character
---
```
// filter.js

angularModule.filter('startsWithLetter', function () {
    return function (items, letter) {
        var letterMatch = new RegExp(letter, 'i');
        return items.filter(function (item) {
          return letterMatch.test(item.name.substring(0, 1));
        });
    };
});

// template.html

<input type="text" ng-model="letter" />
<ul>
  <li ng-repeat="friend in person.friends | startsWithLetter : letter">
    {{ friend }}
  </li>
</ul>
```
Controller/$scope filter
---
```
// controller.js

angularModule.controller('PersonCtrl', function () {
  
  this.startsWithA = function(item){
    return /a/i.test(item.name.substring(0, 1));
  };
  
  this.friends = [{
    name: 'Andrew'        
  }, {
    name: 'Will'
  }, {
    name: 'Mark'
  }, {
    name: 'Alice'
  }, {
    name: 'Todd'
  }];
});

// template.html
<ul>
  <li ng-repeat="friend in person.friends | filter : person.startsWithA ">
    {{ friend }}
  </li>
</ul>
```