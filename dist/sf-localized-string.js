angular.module("sfLocalizedStringTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("src/templates/sf-localized-string.html","<div class=\"form-group\"\n     ng-controller=\"LocalizedStringController\"\n     ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess(), \'has-feedback\': form.feedback !== false }\"\n     schema-validate=\"form\" sf-field-model >\n  <!--<pre>{{form|json}}</pre>-->\n  <label class=\"control-label\" ng-show=\"showTitle()\">{{form.title}}</label>\n  <div class=\"pull-right dropdown\" ng-class=\"{\'open\': open}\" ng-if=\"form.locales && form.locales.length > 1\">\n    <a href class=\"dropdown-toggle badge\" ng-click=\"toggleDropdown()\">{{form.languages[selectedLocale]}} <span class=\"caret\"></span></a>\n    <ul class=\"dropdown-menu\">\n      <li ng-repeat=\"loc in form.locales\"><a href ng-click=\"selectLocale(loc)\">{{form.languages[loc]}}</a></li>\n    </ul>\n  </div>\n  <div ng-if=\"!form.rows || form.rows <= 1\"\n       ng-class=\"{\'form-group\' : !$last}\">\n    <input type=\"text\" class=\"form-control\"\n           ng-model-options=\"{ allowInvalid: true }\"\n           ng-disabled=\"form.readonly\"\n           sf-field-model=\"replaceAll\" ng-model=\"$$value$$[locale]\"\n           ng-repeat=\"locale in form.locales\"\n           ng-show=\"locale === selectedLocale\"/>\n  </div>\n  <div ng-if=\"form.rows && form.rows > 1\"\n       ng-class=\"{\'form-group\' : !$last}\">\n    <div class=\"panel panel-default\" ng-if=\"form.readonly && form.marked\" >\n      <div class=\"panel-body\">\n        <div sf-field-model=\"replaceAll\" ng-bind-html=\"render($$value$$, form.tablestyle)\"></div>\n      </div>\n    </div>\n    <textarea class=\"form-control\" ng-if=\"!form.readonly || !form.marked\"\n              ng-disabled=\"form.readonly\"\n              ng-model-options=\"{ allowInvalid: true }\"\n              sf-field-model=\"replaceAll\" ng-model=\"$$value$$[locale]\"\n              rows=\"{{form.rows ? form.rows : 5}}\"\n              ng-repeat=\"locale in form.locales\"\n              ng-show=\"locale === selectedLocale\"></textarea>\n  </div>\n  <span class=\"help-block\" sf-message=\"form.description\"></span>\n</div>\n");}]);
/*
 * Copyright (c) 2017 OBiBa. All rights reserved.
 *
 * This program and the accompanying materials
 * are made available under the terms of the GNU Public License v3.0.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

angular.module('sfLocalizedString', [
  'schemaForm',
  'sfLocalizedStringTemplates'
]).config(['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfBuilderProvider', 'sfPathProvider',
  function (schemaFormProvider, schemaFormDecoratorsProvider, sfBuilderProvider, sfPathProvider) {

    var locStr = function (name, schema, options) {
      if (schema.type === 'object' && schema.format == 'localizedString') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key = options.path;
        f.type = 'localizedstring';
        if (!f.languages) {
          f.languages = {en: 'English'};
        }
        f.locales = Object.keys(f.languages);
        f.validationMessage = options.global.validationMessage || {};
        f.validationMessage.completed = f.validationMessage.completed ||
          'The field must be completed in all specified languages';

        f.$validators = {
          completed: function (value) {
            if (f.required && value && Object.keys(value).length > 0) {
              return Object.keys(value).filter(function (key) {
                  return f.locales.indexOf(key) > -1 && value[key] && '' !== value[key];
                }).length === f.locales.length;
            }

            return true;
          }
        };
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

  }])
  .controller('LocalizedStringController', ['$scope', '$rootScope', 'marked', function ($scope, $rootScope, marked) {
    $scope.$watch('ngModel.$modelValue', function () {
      if ($scope.ngModel.$validate) {
        // Make sure that allowInvalid is always true so that the model is preserved when validation fails
        
        $scope.ngModel.$validate();
        if ($scope.ngModel.$invalid) { // The field must be made dirty so the error message is displayed
          $scope.ngModel.$dirty = true;
          $scope.ngModel.$pristine = false;
        }
      }
      else {
        $scope.ngModel.$setViewValue(ngModel.$viewValue);
      }
    }, true);

    $scope.$watch('form', function () {
      $scope.form.disableErrorState = $scope.form.hasOwnProperty('readonly') && $scope.form.readonly;
      $scope.selectedLocale = $scope.form.locales && $scope.form.locales.length > 0 ? $rootScope.sfSelectedLocale ? $rootScope.sfSelectedLocale : $scope.form.locales[0] : '';
    });

    $scope.selectLocale = function (locale) {
      $rootScope.$broadcast('sfLocalizedStringLocaleChanged', locale);
      $scope.open = false;
    };

    $scope.toggleDropdown = function () {
      $scope.open = !$scope.open;
    };

    $scope.$on('sfLocalizedStringLocaleChanged', function (event, locale) {
      $scope.selectedLocale = locale;
      $rootScope.sfSelectedLocale = locale;
    });
    
    $scope.render = function (text, tablestyle) {
      if (text && text[$scope.selectedLocale]) {
        var html = marked(text[$scope.selectedLocale]);
        var tstyle = tablestyle ? tablestyle : 'table table-striped table-bordered';
        return html.split('<table>').join('<table class="' + tstyle + '">');
      }
      return '';
    };

    $scope.open = false;

  }]);
