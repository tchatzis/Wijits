app.controller( 'treeCtrl', function( $scope )
{
    $scope.dnd = new DND();

    $scope.data =
    [
        {
            continent:
            {
                name: 'Europe',
                description: 'great wine and cheese',
                countries:
                [
                    {
                        name: 'Italy',
                        cities:
                        [
                            {
                                name: 'Rome',
                                symbol: 'SPQR'
                            },
                            {
                                name: 'Milan'
                            }
                        ]
                    },
                    {
                        name: 'Spain'
                    },
                    {
                        name: 'Greece',
                        stats:
                        {
                            population: 11000000,
                            area: 65000,
                            islands: 6000,
                            language: "Greek"
                        }
                    }
                ]
            }
        },
        {
            continent:
            {
                name: 'South America',
                countries:
                [
                    {
                        name: 'Brasil',
                        cities: [ 'Sao Paolo', 'Rio de Janeiro', 'Florinopolis' ]
                    },
                    {
                        name: 'Peru',
                        cities: [ 'Lima' ]
                    }
                ]
            }
        }
    ];
} );