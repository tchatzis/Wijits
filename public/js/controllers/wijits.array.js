app.controller( 'arrayCtrl', function( $rootScope, $scope, dataservice )
{
    $scope.append = function( args )
    {
        var input = args.scope.form.$$element[ 0 ].children[ 0 ];

        if ( input ) input.focus();

        args.array = args.array || [];
        args.array.push( args.item );

        $scope.item = null;
        $scope.array = args.array;
    };

    $scope.clear = function()
    {
        $scope.array = null;
    };

    $scope.export = function( args )
    {
        $scope.tag = args.tag = JSON.parse( args.tag );

        dataservice.import( args );
    };

    $scope.remove = function( args )
    {
        var index = args.array.indexOf( args.item );

        if ( index > -1 ) args.array.splice( index, 1 );

        $scope.item = null;
        $scope.array = args.array;
    };

    $scope.ls = $rootScope.ls;
} );