var osc1 = new utils.LFO( 'volume' );
    osc1.set( { wave: 'cos', Hz: 0.5 } );

var osc2 = new utils.LFO( 'speed' );
    osc2.set( { wave: 'sin', Hz: 0.1 } );

app.controller( 'meterCtrl', function( $scope, $window, dataservice )
{
    // sets array of bars
    $scope.bars = function( bars )
    {
        return new Array( bars );
    };

    $scope.drag = function( name, listen )
    {
        var change = function()
        {
            var event = new CustomEvent( listen , { detail: { value: $scope.values[ name ] } } );
            dispatchEvent( event );

            $scope.$apply();
        };

        var move = function( e )
        {
            $scope.values[ name ] = $scope.values[ name ] || 0;
            $scope.values[ name ] += Math.sign( e.movementX ) * 0.02;
            $scope.values[ name ] = $scope.values[ name ] < 0 ? 0 : $scope.values[ name ];
            $scope.values[ name ] = $scope.values[ name ] > 1 ? 1 : $scope.values[ name ];

            change( name, $scope.values[ name ], listen )
        };

        var done = function()
        {
            $window.removeEventListener( "mousemove", move );
            $window.removeEventListener( "mouseup", done );

            dataservice.import( { name: name, value: utils.precision( $scope.values[ name ], 2 ) } );
        }

        $window.addEventListener( "mousemove", move );
        $window.addEventListener( "mouseup", done );
    };

    // initialized in widget
    $scope.listen = function( name, listen )
    {
        $window.addEventListener( listen, function( e )
        {
            $scope.value = e.detail.value;
            $scope.$apply();
        } );
    };

    $scope.value = 0;
    $scope.values = {};
} );