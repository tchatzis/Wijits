app.service( 'listservice', function( $http )
{
    var lists =
    {
        cheese: [ "asiago", "brie", "cheddar", "danish", "edam", "feta" ],
        grades: [ "a", "b", "c", "d", "e", "f" ],
        tags:
            [
                {
                    tag: 'input',
                    type: 'checkbox'
                },
                {
                    tag: 'input',
                    type: 'email'
                },
                {
                    tag: 'input',
                    type: 'number'
                },
                {
                    tag: 'input',
                    type: 'radio'
                },
                {
                    tag: 'select',
                    type: 'select'
                },
                {
                    tag: 'input',
                    type: 'text'
                }
            ],
        hours:
        {
            12: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
            24: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0 ]
        },
        days: [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ]


    };

    // preload JSON files
    ( function()
    {
        var names = [ 'colors' ];

        for ( var n = 0; n < names.length; n++ )
        {
            ( function()
            {
                var _n = n;

                $http.get( "/data/" + names[ n ] + ".json" ).then( function ( response )
                {
                    lists[ names[ _n ] ] = response.data;
                } );
            } )();
        }
    } )();

    this.get = function( name )
    {
        return lists[ name ];
    };

    this.read = function( name )
    {
        return name;
    };
} );

app.service( 'dataservice', function()
{
    var data = {};

    this.import = function( args )
    {
        data[ args.name ] = args.value;
        
        console.log( "import", args, data );
    };
} );

app.service( 'dbservice', function()
{
    this.create = function( args )
    {
        var read = function()
        {
            if ( args.callback ) db.read( args.path, args.callback );
        };

        db.create( args.path, args.data, read );
    };

    this.delete = function( args )
    {
        var path = args.path + "/" + args.data.$$hashKey;
        var answer = confirm( "Are you sure you want to delete\n" + path + " ?" );

        if ( answer )
        {
            var read = function()
            {
                if ( args.callback ) db.read( args.path, args.callback );
            };

            db.delete( path, read );
        }
        else
        {
            return false;
        }
    };

    this.read = function( args )
    {
        db.read( args.path, args.callback );
    };

    this.update = function( args )
    {
        var path = args.path + "/" + args.data.$$hashKey;

        var read = function()
        {
            if ( args.callback ) db.read( args.path, args.callback );
        };

        db.update( path, args.data, read );
    };
} );