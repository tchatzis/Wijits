app.controller( 'samplesCtrl', function( $rootScope, $scope, $filter, dbservice )
{
    $scope.revert = {};

    $scope.db = dbservice;

    $scope.cancel = function()
    {
        $scope.revert = {};
        $scope.selected = null;
    };

    $scope.edit = function( item )
    {
        $scope.revert = Object.assign( {}, item );
        $scope.selected = item.$$hashKey;
    };

    $scope.list = function( data )
    {
        $scope.items = $filter( 'array' )( data.data );
        $scope.$applyAsync();
    };

    $scope.db.read( { path: "/samples", callback: $scope.list } );
} );