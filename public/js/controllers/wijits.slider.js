app.controller( 'sliderCtrl', function( $rootScope, $scope, dataservice )
{
    $scope.reset = function( value )
    {
        $scope.item = value;
    };

    $scope.select = function( args )
    {
        $scope.selected = args.value;

        dataservice.import( args );
    };

    $scope.selected = {};
} );