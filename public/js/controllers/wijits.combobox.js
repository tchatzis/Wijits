app.controller( 'comboboxCtrl', function( $rootScope, $scope, $filter, $timeout, dataservice, dbservice )
{
    var data = $scope.$parent.data;

    $scope.db = dbservice;
    $scope.items = [];
    $scope.selected = data.selected;
    $scope.flag = '__new__';
    $scope.message = null;

    $scope.append = function( item )
    {
        var existing = $filter( 'find' )( $scope.items, { [ data.selected.key ]: item[ data.selected.key ] } );

        if ( !existing )
        {
            $scope.items.push( item );

            if ( data.source.type === "database" )
            {
                var confirm = function()
                {
                    $scope.message = item[ data.selected.key ] + " saved";

                    $timeout( function()
                    {
                        $scope.message = null;
                    }, 3000 );

                    $scope.$applyAsync();
                };

                // save to database
                dbservice.create( { data: item, path: data.source.name, callback: confirm } )
            }
        }
        else
        {
            $scope.message = item[ data.selected.key ] + " exists";

            $timeout( function()
            {
                $scope.message = null;
            }, 3000 );
        }

        $scope.item = item[ data.selected.key ];
        $scope.select( { name: data.selected.key, value: $scope.item } );
    };

    $scope.list = function( data )
    {
        $scope.items = $filter( 'array' )( data.data );
        $scope.keys();
        $scope.$applyAsync();
    };

    // get unique keys in $scope.items to create input form
    $scope.keys = function()
    {
        var keys = [];

        var check = function( array )
        {
            var index;
            var key;

            for ( var a = 0; a < array.length; a++ )
            {
                key = array[ a ];
                index = keys.indexOf( key );

                if ( index === -1 )
                {
                    if ( !key.includes( '$$' ) ) keys.push( key );
                }
            }
        };

        var recurse = function( items )
        {
            for ( var key in items )
            {
                if ( items.hasOwnProperty( key ) )
                {
                    if ( typeof items[ key ] === "object" )
                    {
                        check( Object.keys( items[ key ] ) );
                        recurse( items[ key ] );
                    }
                }
            }
        };

        recurse( $scope.items );

        $scope.inputs = keys;
    };

    // get the data
    ( function()
    {
        switch ( data.source.type )
        {
            case "database":
                $scope.db.read( { path: data.source.name, callback: $scope.list } );
            break;

            case "list":
                $scope.items = $rootScope.ls.get( data.source.name );
                $scope.keys();
            break;

            default:

            break;
        }
    } )();

    $scope.select = function( args )
    {
        $scope.selected = args.value;

        if ( args.value !== $scope.flag ) dataservice.import( args );
    };

    $scope.text = function( option )
    {
        if ( typeof option !== data.display.type )
        {
            console.error( "Type mismatch in display object. Expected '" + typeof option + "' but found '" + data.display.type + "'" );
            return option;
        }
        else
        {
            switch (  data.display.type )
            {
                case "object":
                    if ( option.hasOwnProperty( data.display.key ) )
                    {
                        return option[ data.display.key ];
                    }
                    else
                    {
                        console.error( "Key mismatch in display object. '" + data.display.key + "' was not found." );
                        return option;
                    }
                break;

                case "number":
                case "string":
                    return option;
                break;
            }
        }
    };
} );