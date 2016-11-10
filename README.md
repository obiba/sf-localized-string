Schema Form Localizes String Add-on
===================================
 
**sf-localized-string** add-on is used to upload files and store the file DTO's in the form model.

Installation
------------

```
$ bower install sf-localized-string --save
```

Alternatively:

```
$ bower install https://github.com/obiba/sf-localized-string.git#<release-number> --save
```


Make sure to include `sf-localized-string.min.js` in your index file and load the module in your application:

```
var myModule = angular.module('myModule', [
 ...
 'sfLocalizedString','hc.marked'
]);
```

Usage
-----

The schema:

```
"name": {
  "type": "object",
  "format": "localizedString",
  "title": "Name",
  "description": "Name or alias",
  "maxLength": 10,
  "minLength": 2,
  "required": true
}
```

The Definition:

```
{
  "type":"localizedstring",
  "key":"name",
  "showLocales": true
}
```

To enable markdown support, the definition must have the properties ``` rows ``` bigger or equal to  ``` 2 ``` and ``` marked ``` set to ``` true ```.

Example Definition:

```
{
  "type":"localizedstring",
  "key":"name",
  "showLocales": true,
  "rows": 2,
  "marked": true
}
```

Events
------


| Name          | Type          | What |
| ------------- |:-------------:| -----|
| sfLocalizedStringLocaleChanged| String        | changes the current locale|
