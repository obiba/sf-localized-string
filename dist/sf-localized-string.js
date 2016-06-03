angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("src/templates/sf-localized-string-update-on-blur-template.html","<div>\n  <div class=\"input-group form-group\" ng-repeat=\"locale in locales\">\n    <span class=\"input-group-addon\">{{locale}}</span>\n    <input type=\"text\" class=\"form-control\" ng-model=\"modelValue[locale]\" ng-blur=\"updateModel(locale, modelValue)\"></input>\n  </div>\n</div>\n");
$templateCache.put("src/templates/sf-localized-string.html","<div class=\"form-group\">\n  <label>{{form.title}}</label>\n  <update-on-blur sf-field-model schema-validate=\"form\" locales=\"form.locales\"></update-on-blur>\n  <span class=\"help-block\" sf-message=\"form.description\"></span>\n</div>\n");}]);
angular.module('sfLocalizedString', [
  'schemaForm',
  'templates'
]).config(function(schemaFormProvider,  schemaFormDecoratorsProvider, sfBuilderProvider, sfPathProvider) {


  var locStr = function(name, schema, options) {
    if (schema.type === 'object' && schema.format == 'localizedString') {
      var f = schemaFormProvider.stdFormObj(name, schema, options);
      f.key  = options.path;
      f.type = 'localizedstring';
      if(!f.locales) {
        f.locales = ['en'];
      }
      options.lookup[sfPathProvider.stringify(options.path)] = f;
      return f;
    }
  };

  schemaFormProvider.defaults.object.unshift(locStr);
  
  schemaFormDecoratorsProvider.defineAddOn(
    'bootstrapDecorator',           // Name of the decorator you want to add to.
    'localizedstring',                      // Form type that should render this add-on
    'src/templates/sf-localized-string.html',  // Template name in $templateCache
    sfBuilderProvider.stdBuilders   // List of builder functions to apply.
  );

});

angular.module('sfLocalizedString').directive('updateOnBlur', function () {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      locales: '='
    },
    templateUrl: 'src/templates/sf-localized-string-update-on-blur-template.html',
    link: function (scope, element, attrs, ngModel) {
      scope.modelValue = ngModel.$viewValue || {};
      scope.updateModel = function (locale, modelValue) {
        ngModel.$setViewValue(modelValue);
      };
    },
  };
});