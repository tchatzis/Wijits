app.controller( 'numberCtrl', function( $scope, dataservice )
{
    $scope.export = function( args )
    {
        //$scope.tag = args.tag = JSON.parse( args.tag );

        dataservice.import( args );
    };
    
    $scope.set = function( data )
    {
        $scope.data = data;
    };
} );