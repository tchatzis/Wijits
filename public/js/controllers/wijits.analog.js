app.controller( 'analogCtrl', function( $scope, $window )
{
    // initialized by directive 'element'
    $scope.init = function( args )
    {
        $scope.element = args.element;
    };

    // initialized in widget
    $scope.listen = function( name, listen )
    {
        var offset = -90;
        var min = 2;
        var max = 150;
        var range = max - min;
        var deg = 0;

        $window.addEventListener( listen, function( e )
        {
            deg = e.detail.value * range + min + offset;

            $scope.element.style.transform = "rotate( " + deg + "deg )";
            $scope.value = e.detail.value;
            $scope.$apply();
        } );
    };

    $scope.value = 0;
} );