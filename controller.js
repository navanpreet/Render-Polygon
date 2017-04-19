'use strict'
let app = angular.module('myApp', []);

app.controller('Form', function($scope){
	$scope.points = [{'id': 'point1'}, {'id': 'point2'}, {'id': 'point3'}];
	$scope.area = null;
	$scope.transformed = false;
	$scope.color = null;

	$scope.addNewField = function() {
		let newPoint = $scope.points.length + 1;
		$scope.points.push({'id': 'point' + newPoint});
	};
	$scope.removeField = function() {
		let oldPoint = $scope.points.length - 1;
		$scope.points.splice(oldPoint);
	};
	$scope.clearCanvas = function() {
		// set the page to pristine state
		let canvas = document.getElementById("canvas");
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		$scope.area = null;
		$scope.points = [{'id': 'point1'}, {'id': 'point2'}, {'id': 'point3'}];
		$scope.color = null;
	};
	$scope.calculateAndRenderArea = function() {
		let polygon = []
		for (let i = 0; i < $scope.points.length; i++) {
			let coordinate = []; //fetch each coordinate and push it to the polygon
			coordinate.push($scope.points[i].x);
			coordinate.push($scope.points[i].y);
			polygon.push(coordinate);
		}

		$scope.area = findArea(polygon)

		let canvas = document.getElementById("canvas");
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height); 
		polygon = scalepolygongon(polygon); //scale the polygon to a 200*200 in case of very large set of coordinates
		if(!$scope.transformed) {
			ctx.transform(1, 0, 0, -1, 0, canvas.height); //Transform the canvas to render the polygon according to cartesian coordinates
			$scope.transformed = true;
		}
		ctx.fillStyle = $scope.color;
		let area = 0;
		ctx.beginPath();
		ctx.moveTo(polygon[0][0], polygon[0][1]);
		for(let item=1 ; item < numOfPoints ; item+=1 ) {
			ctx.lineTo(polygon[item][0], polygon[item][1])
		}

		ctx.closePath();
		ctx.fill();
	}
});

function scalepolygongon(polygon) {
	let maxLen = 0;
	for(let i = 0; i < polygon.length; i++) {
		let l = Math.abs(polygon[i][0]) > Math.abs(polygon[i][1]) ? Math.abs(polygon[i][0]) : Math.abs(polygon[i][1]);
		if(maxLen == 0 || maxLen < l)
			maxLen = l;
	}
	
	for(let i = 0; i < polygon.length; i++) {
		polygon[i][0] = polygon[i][0] * 200 / maxLen;
		polygon[i][1] = polygon[i][1] * 200 / maxLen;
	}
	return polygon;
}

function findArea(polygon){
	let numOfPoints = polygon.length;
	let area = 0;
	for (let i = 0, l = numOfPoints; i < l; i++) {
		let addX = polygon[i][0];
		let addY = polygon[i == numOfPoints - 1 ? 0 : i + 1][1];
		let subX = polygon[i == numOfPoints - 1 ? 0 : i + 1][0];
		let subY = polygon[i][1];
		area += (addX * addY * 0.5);
		area -= (subX * subY * 0.5);
	}
	return Math.abs(area);
}