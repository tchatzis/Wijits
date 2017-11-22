app.controller( 'rootCtrl', function( $rootScope, $scope, $location, listservice )
{
    $rootScope.selected = {};
    $rootScope.ls = listservice;


    //

    //db.read( 'cocktails', scoped, { scope: $rootScope, name: 'cocktails' } );
    //db.read( 'datalists', scoped, { scope: $rootScope, name: 'datalists' } );
    //db.read( 'measures', scoped, { scope: $rootScope, name: 'measures' } );



    $scope.$on( '$viewContentLoaded', function()
    {
        setTimeout( function(){ utils.resize( 'rotate' ) }, 500 );
    } );

    $rootScope.location = function( path )
    {
        $location.path( path );
    };
} );