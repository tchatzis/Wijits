// filters
app.filter( 'array', function()
{
    return function( obj )
    {
        if ( Array.isArray( obj ) ) return obj;

        return Object.keys( obj ).map( function( key )
        {
            obj[ key ].$$hashKey = key;

            return obj[ key ];
        } );
    };
} );

app.filter( 'contains', function()
{
    return function( array, key )
    {
        return array.indexOf( key ) > -1;
    };
} );

app.filter( 'deeper', function()
{
    return function( val )
    {
        return typeof val === 'object';
    }
} );

app.filter( 'key', function()
{
    var output = [];

    return function( array, key )
    {
        if ( !key ) return array;

        for ( var i = 0; i < array.length; i++ )
        {
            if ( array[ i ].hasOwnProperty( key ) )
            {
                output = array[ i ][ key ];
                break;
            }
        }

        return output;
    };
} );

app.filter( 'objects', function( $filter )
{
    var output = [];

    return function( array, filters )
    {
        if ( !filters || !Object.keys( filters ).length ) return output;

        output = array;

        for ( var filter in filters )
        {
            if ( filters.hasOwnProperty( filter ) )
            {
                output = $filter( 'filter' )( output, { $: filters[ filter ] } );
            }
        }

        return output;
    };
} );

app.filter( 'find', function()
{
    return function( array, filter )
    {
        var output = false;

        if ( !filter ) return array;

        for ( var a = 0; a < array.length; a++ )
        {
            for ( var key in array[ a ] )
            {
                if ( array[ a ].hasOwnProperty( key ) )
                {
                    if ( filter.hasOwnProperty( key ) )
                    {
                        if ( array[ a ][ key ] === filter[ key ] )
                        {
                            output = true;
                            break;
                        }
                    }
                }
            }
        }

        return output;
    };
} );

app.filter( 'findObject', function()
{
    return function( array, filter, key )
    {
        var output = { found: false };

        if ( !filter ) return array;

        // entrire object compared for equality
        var equal = function( k, v )
        {
            for ( var f in filter )
            {
                if ( filter.hasOwnProperty( f ) && v.hasOwnProperty( f ) )
                {
                    if ( v[ f ] === filter[ f ] ) return { index: k, found: true };
                }
            }

            return { found: false };
        };

        // only key compared
        var exists = function( k, v, parent )
        {
            for ( var p in parent )
            {
                if ( parent.hasOwnProperty( p ) )
                {
                    if ( k === key )
                    {
                        if ( filter[ key ] === parent[ p ][ key ] )
                        {
                            return { index: p, found: true };
                        }
                    }
                }
            }

            return { found: false };
        };

        // break true out of loop
        var action = function( search )
        {
            output = search;
        };

        // traverse object
        var recurse = function( object, parent )
        {
            var search;

            for ( var a in object )
            {
                if ( object.hasOwnProperty( a ) )
                {
                    if ( typeof object[ a ] === 'object' )
                    {
                        recurse( object[ a ], object );
                    }
                    else
                    {
                        if ( key )
                        {
                            search = exists( a, object[ a ], parent );
                            if ( search.found ) action( search );
                        }
                        else
                        {
                            search = equal( a, object[ a ], parent );
                            if ( search.found ) action( search );
                        }
                    }
                }
            }
        };

        recurse( array );

        return output;
    };
} );

/*app.filter( 'parent', function()
{
    return function( path )
    {
        path = path.split( "/" );

        return path[ path.length - 1 ];
    };
} );*/

app.filter( 'precision', function()
{
    return function( value, step )
    {
        var log = Math.ceil( Math.log10( step ) );
        var precision = log < 0 ? Math.abs( log ) : 0;

        return value.toFixed( precision );
    };
} );

/*app.filter( 'system', function( $rootScope, $filter )
{
    return function( count )
    {
        var measures = $filter( 'filter' )( $rootScope.measures, { count: count } )[ 0 ];
        var value;
        var unit;
        var output;

        switch( $rootScope.settings.system )
        {
            case "count":
                output = measures.count + " count";
            break;

            case "imperial":
                unit = measures.system[ $rootScope.settings.system ].unit;
                output = measures.name === unit ? measures.name : measures.name + " " + unit;
            break;

            case "metric":
                value = measures.system[ $rootScope.settings.system ].value;
                unit = measures.system[ $rootScope.settings.system ].unit;
                output = measures.name === unit ? value : value + " " + unit;
            break;
        }

        return output;
    };
} );*/

app.filter( 'unicode', function( $sce )
{
    return function( char )
    {
        return $sce.trustAsHtml( char );
    };
} );