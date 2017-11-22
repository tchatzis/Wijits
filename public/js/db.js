var db = ( function()
{
    var delimiter = '/';

    var create = function( path, data, callback )
    {
        var post = database.ref( path );
            post.push( data, callback );
    };

    var del = function( path, callback )
    {
        var post = database.ref( path );
            post.remove( callback );
    };

    var read = function( path, callback, config )
    {
        database.ref( path ).once( 'value' ).then( function( data )
        {
            if ( callback )
            {
                if ( !config ) config = {};

                config.data = data.val();

                callback( config );
            }

            return data;
        } );
    };

    var rename = function( args )
    {
        // USAGE: db.rename( { path: 'liquors', replace: 'spirit', with: 'name' } );

        database.ref( args.path ).once( 'value' ).then( function( data )
        {
            var object = data.val();
            var keys = [];
            var path = delimiter + args.path;
            var temp;
            var use = '';
            var array = [];

            var recurse = function( obj, k )
            {
                keys = Object.keys( obj );
                path = k ? path + delimiter + k : path;

                for ( var key in obj )
                {
                    if ( obj.hasOwnProperty( key ) )
                    {
                        if ( typeof ( obj[ key ] ) === 'object' )
                        {
                            if ( Array.isArray( obj[ key ] ) )
                            {
                                temp = temp || path;
                                path = temp + delimiter + key + delimiter + k;
                                use = path;
                                array = use.split( delimiter );
                            }

                            if ( key === array[ array.length - 1 ] )
                            {
                                if ( obj[ key ].hasOwnProperty( args.replace ) )
                                {
                                    obj[ key ][ args.with ] = obj[ key ][ args.replace ];
                                    obj[ key ][ args.replace ] = null;
                                    //console.log( use, obj[ key ] );
                                    db.update( use, obj[ key ] );
                                    delete obj[ key ][ args.replace ];
                                }
                            }

                            recurse( obj[ key ], key );
                        }
                    }
                }
            }

            recurse( object );
        } );
    };

    var scrub = function( args )
    {
        var data = args.data;

        var recurse = function( data )
        {
            for ( var key in data )
            {
                if ( data.hasOwnProperty( key ) )
                {
                    for ( var k = 0; k < args.scrub.length; k++ )
                    {
                        if ( key.includes( args.scrub[ k ] ) ) delete data[ key ];
                    }

                    if ( typeof data[ key ] === 'object' ) recurse( data[ key ] );
                }
            }
        };

        recurse( data );

        return data;
    };

    var update = function( path, data, callback )
    {
        data = scrub( { data: data, scrub: '$$' } );

        var post = database.ref( path );
            post.update( data, callback );
    };

    return {
        create: create,
        delete: del,
        read: read,
        rename: rename,
        scrub: scrub,
        update: update
    };
} )();