app.controller( 'knobCtrl', function( $rootScope, $scope, dataservice )
{
    var Knob = function()
    {
        var self = this;
        var d;
        var sensitivity = 1;
        var dir = 0;

        var rotate = function( event )
        {
            self.control.parameters.factor = self.control.parameters.factor ? self.control.parameters.factor : 1;

            dir = event.movementX;
            d = d ? d : self.scope.item ? self.control.range * ( self.scope.item / self.control.parameters.factor ) : 0;
            d += ( dir * sensitivity );

            if ( self.control.type === "knob" )
            {
                d = d < self.control.min ? self.control.min : d;
                d = d > self.control.max ? self.control.max : d;
            }

            self.control.element.style.transform = "rotate( " + d + "deg )";
            self.scope.$apply();

            $scope.values[ self.control.parameters.name ] = self.scope.item = ( self.control.parameters.factor * d ) / self.control.range;
            $scope.$apply();

            if ( self.export )
            {
                var controls = self.control.parameters;
                    controls.value = self.scope.item;

                var args =
                {
                    tag: { tag: 'eq', type: 'eq', controls: controls },
                    name: self.control.parameters.name,
                    value: self.scope.item
                };

                $scope.export( args );
            }
        };

        this.event = function( args )
        {
            $scope.knob.init( { scope: args.scope, element: args.event.target, parameters: args.scope.control } );

            var cancel = function()
            {
                removeEventListener( 'mousemove', rotate );
                args.event.target.classList.remove( 'on' );
            };

            if ( event.type === "mousedown" )
            {
                addEventListener( 'mousemove', rotate );
                addEventListener( 'mouseup', cancel );
                args.event.target.classList.add( 'on' );
            }
        };

        this.export = false;

        this.init = function( args )
        {
            self.scope = args.scope;
            self.control = {};
            args.parameters.factor = args.parameters.factor ? args.parameters.factor : 1;

            switch ( args.parameters.class )
            {
                case "dial":
                    self.control.min = 0;
                    self.control.max = 360;
                    self.control.type = "dial";
                break;

                case"knob":
                    self.control.min = 0;
                    self.control.max = 270;
                    self.control.type = "knob";
                break;
            }

            self.control.range = self.control.max - self.control.min;
            self.control.element = args.element;
            self.control.element.style.transform = "rotate( " + ( self.control.range * args.scope.item ) / args.parameters.factor % 360 + "deg )";
            self.control.parameters = args.parameters;
        };

        this.set = function( args )
        {
            $scope.knob.init( { scope: args.scope, element: args.element, parameters: JSON.parse( args.attributes.element ) } );
        };

        this.reset = function()
        {
            self.control.element.style.transform = "rotate( " + 0 + "deg )";
            self.scope.item = 0;
            self.scope.$apply();
        };
    };

    $scope.init = function( args )
    {
        $scope.knob = new Knob( $scope );
        $scope.knob.init( { scope: args.scope, element: args.element, parameters: JSON.parse( args.attributes.element ) } );
    };

    $scope.export = function( args )
    {
        $scope.tag = args.tag;

        dataservice.import( args );
    };

    $scope.reset = function( args )
    {
        $scope.knob.reset( args );
    };

    $scope.values = {};
} );