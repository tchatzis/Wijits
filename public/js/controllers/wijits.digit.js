app.controller( 'digitCtrl', function( $scope, $window )
{
    var characters =
    {
        0: [ 10, 1, 21, 3, 23, 14 ],
        1: [ 21, 23 ],
        2: [ 10, 21, 12, 3, 14 ],
        3: [ 10, 21, 12, 23, 14 ],
        4: [ 1, 21, 12, 23 ],
        5: [ 10, 1, 12, 23, 14 ],
        6: [ 10, 1, 12, 3, 23 , 14 ],
        7: [ 10, 21, 23 ],
        8: [ 10, 1, 21, 12, 3, 23, 14 ],
        9: [ 10, 1, 21, 12, 23, 14 ]
    };

    // initialized in widget
    $scope.listen = function( name, listen )
    {
        $window.addEventListener( listen, function( e )
        {
            $scope.value = Math.round( e.detail.value * 10 ) % 10;
            $scope.$apply();
        } );
    };

    $scope.on = function( value, segment )
    {
        var array = characters[ value ];

        return array.indexOf( segment ) > -1;
    };

    $scope.value = 0;
} );