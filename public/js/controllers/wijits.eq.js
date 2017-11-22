app.controller( 'eqCtrl', function( $rootScope, $scope, dataservice )
{
    $scope.import = function( args )
    {
        $scope.values[ args.child ] = args.value;
    };

    $scope.export = function( args )
    {
        $scope.tag = args.tag = Object.keys( args.tag ) ? args.tag : JSON.parse( args.tag );

        dataservice.import( args );
    };

    $scope.values = {};
} );