app.controller( 'gridCtrl', function( $scope, $filter, dataservice )
{
    var min = 70;
    var max = 300;

    $scope.rows = [];
    $scope.add = {};
    $scope.types =
    {
        text:
        {
            text: 'text',
            min: min,
            max: max
        },
        number:
        {
            text: 'number',
            min: 70,
            max: 100
        },
        email:
        {
            text: 'email',
            min: 100,
            max: max
        },
        date:
        {
            text: 'date',
            min: 130,
            max: 130
        }
    };
    $scope.type = { min: min, max: max };
    $scope.mode = 'input';
    $scope.column = {};

    $scope.addColumn = function( column )
    {
        $scope.message = null;

        var clone = Object.assign( {}, column );
        var find = $filter( 'findObject' )( $scope.columns, clone, 'id' );

        if ( !find.found )
        {
            clone.id = utils.guid();
            $scope.columns.push( clone );
        }

        if ( find.found )
        {
            $scope.columns[ find.index ] = clone;
            $scope.message = "Column Exists. Updated.";
        }

        $scope.column = {};
    };
    
    $scope.removeColumn = function( column )
    {
        var find = $filter( 'findObject' )( $scope.columns, column, 'id' );

        if ( find.found ) $scope.columns.splice( find.index, 1 );
    };

    $scope.addRow = function( args )
    {
        args.$schema =
        {
            id : utils.guid(),
            label: args.$label ? args.$label : $scope.rows.length
        };

        delete args.$label;

        $scope.rows.push( args );
        $scope.add = {};
    };

    $scope.removeRow = function( args )
    {
        var find = $filter( 'findObject' )( $scope.rows, args, 'id' );

        if ( find.found ) $scope.rows.splice( find.index, 1 );
    };
    
    $scope.edit = function( column )
    {
        $scope.message = null;
        $scope.column = Object.assign( {}, column );
        $scope.mode = "edit";
    };

    $scope.export = function( args )
    {
        //$scope.tag = args.tag = JSON.parse( args.tag );

        dataservice.import( args );
    };
    
    $scope.select = function( type )
    {
        $scope.type = $scope.types[ type ];
    };

    $scope.set = function( data )
    {
        if ( data.columns )
        {
            for ( var column in data.columns )
            {
                if ( data.columns.hasOwnProperty( column ) )
                {
                    data.columns[ column ].id = utils.guid();
                    delete data.columns[ column ].$$hashKey;
                }
            }

            $scope.columns = data.columns;
            $scope.mode = 'input';
        }
        else
        {
            $scope.mode = 'edit';
        }
    };

    $scope.setMode = function( mode )
    {
        $scope.message = null;
        $scope.mode = mode;
    };
} );