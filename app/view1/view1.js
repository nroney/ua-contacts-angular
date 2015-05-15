'use strict';

angular.module('myApp.view1', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/view1', {
			templateUrl: 'view1/view1.html',
			controller: 'View1Ctrl'
		});
	}])


	.controller('View1Ctrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {


		var data;
		var filteredItems;

		$scope.curPage = 1;
		$scope.pageSize = 10;
		$scope.totalPages = 1;
		$scope.states = [];
		$scope.searchText = '';
		$scope.state = '';


		$http.get('sample-data.json')
			.then(function (res) {
				//ordering by state
				data = $filter('orderBy')(res.data, 'state');

				//save a searchText for searching case insensitive in an efficient manner
				angular.forEach(data, function (contact) {
					contact.searchText = contact.first_name.toLowerCase() + ' ' + contact.last_name.toLowerCase();
				});

				filteredItems = data;

				$scope.states = [''];

				//check to see if state exists in array, if not we push state into the array
				angular.forEach(data, function (contact) {
					if ($scope.states.indexOf(contact.state) === -1) {
						$scope.states.push(contact.state);
					}
				});
				setContacts();
			});

		$scope.search = function () {
			//if the search text is empty we just want the full data

			if (!$scope.searchText && !$scope.state) {
				filteredItems = data;
			} else {
				filteredItems = [];
				angular.forEach(data, function (contact) {
					//var searchFilter = $scope.searchText === '' || contact.first_name.indexOf($scope.searchText) > -1 || contact.last_name.indexOf($scope.searchText) > -1;
					var searchFilter = $scope.searchText === '' || contact.searchText.indexOf($scope.searchText.toLowerCase()) > -1;
					var stateFilter = $scope.state === '' || contact.state === $scope.state;
					if (searchFilter && stateFilter) {
						filteredItems.push(contact);
					}

				});
			}
			$scope.curPage = 1;
			setContacts();
		};

		$scope.changeAmount = function () {
			//$scope.pageSize = pageSize;
			$scope.curPage = 1;
			setContacts();
		};

		$scope.prevPage = function () {
			$scope.curPage--;
			setContacts();
		};
		$scope.nextPage = function () {
			$scope.curPage++;
			setContacts();
		};

		$scope.prevPageDisabled = function () {
			return $scope.curPage <= 1;
		};

		$scope.nextPageDisabled = function () {
			return $scope.totalPages <= $scope.curPage;
		};

		$scope.clearFilters = function () {
			//clears all filters
			$scope.state = '';
			setContacts();
		};

		function setContacts() {
			//update page count
			$scope.totalPages = Math.ceil(filteredItems.length / $scope.pageSize);
			var startItem = ($scope.curPage - 1) * $scope.pageSize;
			var endItem = startItem + $scope.pageSize;
			$scope.contacts = filteredItems.slice(startItem, endItem);

		}


	}]);



