app.controller( 'multiCtrl', function( $rootScope, $scope, dataservice )
{
    var selected = [];

    $scope.toggle = function( args )
    {
        var index = selected.indexOf( args.value );

        if ( index > -1 )
        {
            selected.splice( index, 1 );
        }
        else
        {
            selected.push( args.value );
        }

        args.value = selected;

        dataservice.import( args );
    };

    $scope.selected = function( item )
    {
        return selected.indexOf( item ) > -1;
    };
} );