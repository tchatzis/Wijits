app.controller( 'rangeCtrl', function( $rootScope, $scope, dataservice )
{
    var px = "px";
    var speed = 4;

    var Range = function( $scope )
    {
        var self = this;
            self.values = {};

        var apply = function()
        {
            $scope.values.lower = evaluate( self.values.lower * self.width );
            $scope.values.upper = evaluate( self.values.upper * self.width );
            $scope.$apply();
        };

        var between = function( value, low, high )
        {
            return { value: value < low ? low : value > high ? high : value, is: ( value > low ) && ( value < high ) };
        };

        // value to scale
        var evaluate = function( value )
        {
            var factor =  self.width / self.range;

            return value / factor + $scope.values.min;
        };

        var limits = function( low, high )
        {
            // defaults
            var lower = self.values.lower ? self.values.lower : ( $scope.values.lower - $scope.values.min ) / self.range;
            var upper = self.values.upper ? self.values.upper : ( $scope.values.upper - $scope.values.min ) / self.range;

            self.values.lower = between( lower, low, high ).value;
            self.values.upper = between( upper, lower, 1 ).value;
            self.values.limit = between( self.values.upper - self.values.lower, 0, 1 ).value;

            return between( lower, 0, 1 ).is && between( upper, 0, 1 ).is && between( self.values.limit, 0, 1 ).is;
        };

        var move = function( e )
        {
            e.preventDefault();
            e.stopPropagation();

            var element = e.target.getAttribute( "element" );
            var i = ( Math.sign( e.movementX ) * speed / self.width );

            switch ( element )
            {
                case "limit":
                    self.values.lower = self.values.lower + i;

                    limits( 0, 1 - self.limit / self.width );

                    e.target.style.left = self.values.lower * self.width + px;
                    e.target.style.width = self.limit + px;

                    self.values.upper = Math.min( self.values.lower + self.limit / self.width, 1 );

                    apply();
                break;

                case "lower":
                    self.values.lower = self.values.lower + i;

                    limits( 0, self.values.upper - i );

                    e.target.parentNode.style.left = self.values.lower * self.width + px;
                    e.target.parentNode.style.width = self.values.limit * self.width + px;

                    apply();

                    self.values.limit = self.values.limit - i;
                break;

                case "upper":
                    limits( self.values.lower, 1 );

                    e.target.parentNode.style.left = self.values.lower * self.width + px;
                    e.target.parentNode.style.width = self.values.limit * self.width + px;

                    apply();

                    self.values.upper = self.values.upper + i;
                break;
            }
        };

        this.disable = function( e )
        {
            e.target.removeEventListener( 'mousemove', move );
            e.target.classList.remove( 'on' );

            document.exitPointerLock();

            // TODO: check controls object
            $scope.export( { name: $scope.$parent.name, label: $scope.$parent.label, value: { lower: $scope.values.lower, higher: $scope.values.upper }, tag: { tag: 'range', type: 'range', controls: { min: $scope.values.min, max: $scope.values.max } } } )
        };

        this.enable = function( e )
        {
            e.preventDefault();
            e.stopPropagation();

            e.target.addEventListener( 'mousemove', move );
            e.target.addEventListener( 'pointerlockchange', this.disable );
            e.target.classList.add( 'on' );
            e.target.requestPointerLock();
        };

        this.get = function( name )
        {
            return this[ name ];
        };

        this.render = function( element )
        {
            limits();

            element.style.left = self.values.lower * self.width + px;
            element.style.width = self.limit + px;
        };

        this.set = function( name, value )
        {
            this[ name ] = value;
        };
    };

    var control = new Range( $scope );

    $scope.element = {};

    $scope.export = function( args )
    {
        $scope.tag = args.tag;

        dataservice.import( args );
    };

    // initialized by directive 'element'
    $scope.init = function( args )
    {
        var name = args.attributes.element;

        $scope.element[ name ] = args.element;

        if ( Object.keys( $scope.element ).length === 4 )
        {
            control.set( 'width', $scope.element[ 'limit' ].parentNode.clientWidth );
            control.set( 'limit', $scope.element[ 'limit' ].clientWidth );
            control.set( 'range', $scope.values.max - $scope.values.min );
            control.render( $scope.element[ 'limit' ] );

            $scope.element[ 'limit' ].addEventListener( 'mousedown', control.enable );
            $scope.element[ 'lower' ].addEventListener( 'mousedown', control.enable );
            $scope.element[ 'upper' ].addEventListener( 'mousedown', control.enable );

            $scope.element[ 'limit' ].addEventListener( 'mouseup', control.disable );
            $scope.element[ 'lower' ].addEventListener( 'mouseup', control.disable );
            $scope.element[ 'upper' ].addEventListener( 'mouseup', control.disable );
        }
    };

    $scope.set = function( data )
    {
        $scope.values = data;
        //console.info( "set", $scope.values );
    };
} );