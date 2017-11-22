app.controller( 'colorCtrl', function( $rootScope, $scope, dataservice )
{
    $scope.select = function( args )
    {
        $scope.selected = args.value;

        dataservice.import( args );
    };

    $scope.selected = {};
} );