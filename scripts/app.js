angular.module('app', ['ngResource'])
    // SERVICE
    .service('FillText', ['$resource', function($resource) {
        var FillTextMethods = {};

        FillTextMethods.query = {
            method: 'JSONP',
            params: {
                rows: 100,
                id: '{index}',
                firstName: '{firstName}',
                lastName: '{lastName}',
                salary: '{numberRange|100to2000}',
                bonus: '{numberRange|200to500}',
                department: '["marketing","accounting", "purchasing", "product development"]'
            },
            isArray: true 
        };

        var FillText = $resource('http://filltext.com/', {
            id: '@id',
            callback: "JSON_CALLBACK"
        }, FillTextMethods);

        return FillText;

    }])
    // SERVICE END
    // CONTROLLER
    .controller('AppCtrl', ['$scope', 'FillText', function($scope, FillText) {
        $scope.employees = [];
        var self = this;
        
        self.filteredDepartments = [{
            name: "marketing",
            selected: true
          },{
            name: "accounting",
            selected: true
          },{
            name: "purchasing",
            selected: true
          },{
            name: "product development",
            selected: true
          }];
        
        self.orderByTotal = function(employee){
            return employee.salary + employee.bonus;
        };
        
        self.filteredDepartment = function(employee){
          var employeeDepartment = self.filteredDepartments
          .filter(function ( department ) {
              return department.name === employee.department;
          })[0];
          
          return employeeDepartment.selected;
        };
        
        FillText.query()
        .$promise
        .then(function(results) {
            $scope.employees = results;
            
        }, function(err) {
            console.log(err);
            
        });
    }])
    // CONTROLLER END
    // FILTER 
    .filter('initials', function(){
        return function(name){
            var nameItems = name.split(' ');
            var initials = [];
            angular.forEach(nameItems, function(nameItem){
                initials.push(nameItem.substring(0,1) + '.');
            });
            return initials.join('');
        };
    })
    // FILTER END
    .filter('searchName', function(){
      return function(items, name){
        var pattern = new RegExp(name, 'i');
        return items.filter(function(item){
            return pattern.test(item.firstName + ' ' + item.lastName);
        });
      }
    });