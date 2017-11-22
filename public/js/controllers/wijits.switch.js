app.controller( 'switchCtrl', function( $scope, dataservice )
{
    $scope.toggle = function( name )
    {
        $scope.values[ name ] = !$scope.values[ name ];
        
        dataservice.import( { name: name, value: $scope.values[ name ] } );
    };

    $scope.values = {};
} );