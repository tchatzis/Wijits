var utils = ( function()
{
    var bubble = function( scope, key )
    {
        var o = null;

        do
        {
            scope = scope.$parent;
            o = { scope: scope, obj: scope[ key ] };
        }
        while ( !scope.hasOwnProperty( key ) )

        return o;
    };

    var debounce = function ( fn, delay )
    {
        var timer = null;
        delay = delay || 250;

        return ( function()
        {
            var args = arguments;
            clearTimeout( timer );

            timer = setTimeout( function()
            {
                fn.apply( this, args );
            }.bind( this ), delay );
        } )();
    };

    var dom = function( node, i )
    {
        var delimiter = '/';
        var values = [];

        var set = function( value )
        {
            values.push( value );
        };

        var recurse = function( args )
        {
            var key;
            var value;
            var ds = {};
            var path = args.path || '';

            for ( var n = 0; n < args.node.childNodes.length; n++ )
            {
                if ( args.node.childNodes[ n ] )
                {
                    ds = Object.assign( {}, args.node.childNodes[ n ].dataset );

                    args.value = args.value ? args.value : ds.array ? [] : {};

                    if ( Object.keys( ds ).length )
                    {
                        key = ds.key || ds.index;

                        if ( key )
                        {
                            // initialize an empty value
                            value = ds.array ? new Array( args.node.childNodes[ n ].childNodes.length ) : {};
                            // if there's an args.value then pass it through
                            value = args.value ? args.value : value;
                            // if there's an ds.value then pass it through
                            value = ds.value ? ds.value : value;

                            // initialize value to be array with no key
                            if ( !!ds.array ) args.value = value;

                            path += delimiter + key;

                            args.parent.value[ key ] = value;

                            //args.functions.report.call( this, { array: !!ds.array, key: key, value: value, parent: args.parent, path: path } );
                            args.functions.set.call( this, args.parent.value );
                        }
                    }

                    // remember value for nodes with no dataset
                    key = key ? key : args.parent.key;

                    recurse( { node: args.node.childNodes[ n ], value: value, parent: { key : key, value: args.value }, functions: args.functions, path: path } );
                }
            }
        };

        recurse( { node: node, parent: {}, functions: { set: set } } );

        return values[ i ];
    };

    var guid = function()
    {
        function s4()
        {
            return Math.floor( ( 1 + Math.random() ) * 0x10000 )
                .toString( 16 )
                .substring( 1 );
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    var is = function( obj )
    {
        return {
            type: typeof obj === 'object' ? Array.isArray( obj ) ? 'array' : 'object' : typeof obj,
            array: Array.isArray( obj ),
            object: typeof obj === 'object',
            children: Array.isArray( obj ) || !!Object.keys( obj ).length,
            length: Array.isArray( obj ) ? obj.length : Object.keys( obj ).length,
            keys: Object.keys( obj )
        };
    };

    var json = function( args )
    {
        var url = "/data/";
        var file = args.file ? args.file : args.name;

        args.http.get( url + file + ".json" ).then( function ( response )
        {
            args.scope[ args.name ] = response.data;

            if ( args.callback ) args.callback( response.data );
        } );
    };

    var LFO = function( name )
    {
        var self = this;

        this.wave = function()
        {
            self.theta = self.theta + 0.01 * ( Math.PI * 2 ) * self.params.Hz;
            self.value = ( Math[ self.params.wave ]( self.theta ) + 1 ) / 2;

            var event = new CustomEvent( name, { detail: { value: self.value, theta: self.theta } } );
            dispatchEvent( event );

            utils.debounce( self.wave, 1 / self.params.Hz );
        };

        this.sin = this.cos;

        this.get = function()
        {
            return self.value;
        };

        this.set = function( args )
        {
            self.theta = 0
            self.params = args;
            self.wave();
        };
    };

    var precision = function( number, decimal )
    {
        return parseFloat( Math.round( number * Math.pow( 10, decimal ) ) / Math.pow( 10, decimal ) ).toFixed( decimal );
    };

    var resize = function( name )
    {
        var els = document.querySelectorAll( "div[class='" + name + "']" );
        var el;
        var p;

        for ( var e = 0; e < els.length; e++ )
        {
            el = els[ e ];
            el.style.top = el.offsetWidth + "px";

            p = el.parentNode;
            p.style.height = el.offsetWidth + 'px';
        }
    };

    return {
        bubble: bubble,
        debounce: debounce,
        dom: dom,
        guid: guid,
        json: json,
        is: is,
        LFO: LFO,
        precision: precision,
        resize: resize
    }
} )();