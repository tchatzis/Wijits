var Tree = function( $rootScope, $scope, $filter, $location, name )
{
    // private functions

    var bool =  function( value )
    {
        var boolean;

        if ( value === undefined ) boolean = false;
        if ( value === "false" ) boolean = false;

        if ( value === "true" ) boolean = true;
        if ( value === "0" || value === 0 ) boolean = true;

        return boolean;
    };

    var bubble = function( target, attr )
    {
        while ( !target.hasAttribute( attr ) )
        {
            target = target.parentNode;
        }

        return { element: target, attribute: target.getAttribute( attr ) };
    };

    var children = function( target, tagName, attr )
    {
        var animation = new Animation();
        var start = 0;
        var end = 0;
        var parent;

        var recurse = function( element )
        {
            for ( var c = 0; c < element.childNodes.length; c++ )
            {
                if ( element.childNodes[ c ].nodeType === 1 )
                {
                    if ( element.childNodes[ c ].tagName === tagName.toUpperCase() && bool( element.childNodes[ c ].getAttribute( attr ) ) )
                    {
                        end = element.childNodes[ c ].offsetHeight;

                        parent = target;
                        target = element.childNodes[ c ];

                        if ( self.mode.edit )
                        {
                            target.style.height = 'auto';
                            target.style.overflow = 'visible';
                        }
                        else
                        {
                            target.style.height = start;
                            target.style.overflow = 'hidden';
                            animation.from( parent, target, 'height', start, end );
                        }

                        break;
                    }
                }

                recurse( element.childNodes[ c ] );
            }
        };

        setTimeout( function(){ recurse( target ) }, delay );

        return target;
    };

    var delay = 34;

    var delimiter = '/';

    var included = function( array, key )
    {
        var index = array.indexOf( key );

        if ( key && index === -1 )
        {
            array.push( key );
        }
        else
        {
            array.splice( index, 1 );
        }

        return array;
    };

    var objectify = function( array )
    {
        var object = {};

        for ( var i = 0; i < array.length; i++ )
        {
            if ( i % 2 === 0 ) object[ array[ i ] ] = parseInt( array[ i + 1 ] );
        }

        return object;
    };

    var pathify = function( object )
    {
        var path = [];

        for ( var key in object )
        {
            if ( object.hasOwnProperty( key ) )
            {
                path.push( key, object[ key ] );
            }
        }

        return path.join( delimiter );
    };

    var self = this;

    var value = function( target )
    {
        return bubble( target, 'data-value', false ).attribute.toLowerCase();
    };

    // public methods

    this.action = function( $event, action, data, path )
    {
        $event.stopPropagation();

        var actions = {};

        actions.create = function( path )
        {
            //console.log( action, path.join( delimiter ), data );

            db.create( path.join( delimiter ), data, self.refresh );
        };

        actions.delete = function( path )
        {
            console.log( action, path.join( delimiter ) );

            db.delete( path.join( delimiter ), self.refresh );
        };

        actions.update = function( path )
        {
            //console.log( action, path.join( delimiter ), data );

            db.update( path.join( delimiter ), data, self.refresh );
        };

        // explicit path in arguments
        if ( path )
        {
            actions[ action ]( path.split( delimiter ) );
        }
        // find path by value
        else
        {
            this.treepath = bubble( $event.target, "data-path" ).attribute;
            this.find( actions[ action ] );
        }
    };

    this.animate = function( $event )
    {
        if ( $event )
        {
            var target = bubble( $event.target, 'data-open' );
            var ul = target.element;

            children( ul, 'ul', 'data-open' );
        }
    };

    this.data = [];

    this.datapath = [];

    this.define = function( value )
    {
        return( value === undefined ) ? 0 : value;
    };

    this.done = function()
    {
        this.mode.edit = false;
        this.location( '/cocktails' );
    };

    this.edit = function()
    {
        this.mode.edit = true;
        this.animate( this.event );
        this.location( '/' + name );
    };

    this.event = {};

    this.expand = function()
    {
        var ignore = [ '$$hashKey', 'count' ];
        var data = {};
            data[ name ] = this.data;
        var value;

        if ( $scope.data )
        {
            // recursive search sorted object
            var search = function( obj, key, val )
            {
                obj = $filter( 'orderBy' )( obj[ key ], 'name' )

                for ( var k in obj )
                {
                    if ( obj.hasOwnProperty( k ) )
                    {
                        if ( obj[ k ].name === val )
                        {
                            self.selected[ key ] = parseInt( k );
                            data = obj[ k ];
                            break;
                        }
                    }
                }
            };

            // get keys from data
            for ( var key in $scope.data )
            {
                if ( $scope.data.hasOwnProperty( key ) )
                {
                    if ( ignore.indexOf( key ) === -1 )
                    {
                        value = $scope.data[ key ];
                        search( data, key, value )
                    }
                }
            }
        }
    };

    // find the database path
    this.find = function( callback )
    {
        var path = this.treepath.split( delimiter ).slice();

        var check = function( unsorted, sorted )
        {
            for ( var i in unsorted )
            {
                if ( unsorted.hasOwnProperty( i ) )
                {
                    if ( unsorted[ i ] === sorted ) return i;
                }
            }

            return unsorted.length;
        };

        ( function()
        {
            var datapath = path.slice();
            var unsorted =  self.data;
            var sorted = $filter( 'orderBy' )( unsorted, 'name' );

            for ( var i = 1; i < path.length; i++ )
            {
                // for new item in path
                if ( !sorted )
                {
                    datapath[ i - 1 ] = path[ i - 1 ];
                    break;
                }

                datapath[ i ] = check( unsorted, sorted[ path[ i ] ] );
                unsorted = unsorted[ datapath[ i ] ];
                sorted = Array.isArray( sorted[ path[ i ] ] ) ? $filter( 'orderBy' )( sorted[ path[ i ] ], 'name' ) : sorted[ path[ i ] ];
            }

            self.datapath = datapath;

            callback( datapath );
        } )();
    };

    this.location = function( path )
    {
        $location.path( path );
    };

    this.mode = {};

    // get data from database
    this.refresh = function()
    {
        var refresh = function( args )
        {
            $rootScope[ name ] = args.data;
            $rootScope.$apply();

            self.data = args.data;
            self.expand();
        };

        db.read( name, refresh );
    };

    this.select = function( $event, path )
    {
        this.event = $event;

        for( var key in path )
        {
            if ( path.hasOwnProperty( key ) )
            {
                this.selected[ key ] = path[ key ];
            }
        }

        this.animate( $event );
    };

    this.selected = {};

    //TODO: complete toggle
    this.toggle = function( $event )
    {
        $event.stopPropagation();

        var path = bubble( $event.target, "data-path" ).attribute.split( delimiter );
        var selected = objectify( path );
        //var selected = pathify( $scope.selected );
        //var predicate = selected.search( path ) > -1;

        //$event.target.innerText = predicate ? '+' : '-';
        this.select( $event, selected );



        //console.log( "toggle", path, selected );
    };
};
