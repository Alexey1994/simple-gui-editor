var ScriptEditorComponent = AnonimComponent(
    [
        ['div', [
            [TextComponent]
        ]]
    ],

    [],
    [],

    function() {
        var program = {
            functions: [
                {
                    name: 'call',
                    inputs: [
                        'function_index'
                    ],
                    outputs: [
                        'result'
                    ],
                    body: [
                        {
                            type: 'write',
                            for_each: 'functions[function_index].inputs',
                            action: 'argument'
                        },
                        {
                            type: 'write',
                            for_each: 'functions[function_index].outputs'
                        },
                        {
                            type: 'write',
                            string: 'call '
                        },
                        {
                            type: 'write',
                            expression: 'functions[function_index].name'
                        }
                    ]
                },

                {
                    name: 'argument',
                    inputs: [
                        'function_index'
                    ],
                    outputs: [
                        'result'
                    ],
                    body: [
                        {
                            type: 'write',
                            string: 'call '
                        },
                        {
                            type: 'write',
                            expression: 'functions[function_index].name'
                        }
                    ]
                },

                {
                    name: 'меньше чем',
                    inputs: [
                        'a',
                        'b'
                    ],
                    outputs: [
                        'result'
                    ],
                    body: [
                        {
                            type: 'write',
                            string: 'sub '
                        },
                        {
                            type: 'write',
                            string: 'sub '
                        }
                    ]
                },

                {
                    name: 'f',
                    inputs: [
                        {
                            name: 'abc',
                            index: 0
                        }
                    ],
                    outputs: [
                        {
                            name: 'def',
                            index: 1
                        }
                    ],
                    body: [
                        {
                            type: 'call',
                            arguments: [1]
                        }
                    ]
                }
            ]
        }
    },

    function() {
        
    }
)

function parseFunctions(functions) {
    var result = ''

    function executeCommands(commands, args) {
        for(var argumentName in args)
            eval(`var ${argumentName} = args['${argumentName}']`)

        commands.forEach(command => {
            if(command.type == 'write') {
                if(command.hasOwnProperty('string')) {
                    result += command.string
                }
                else if(command.hasOwnProperty('expression')) {
                    result += eval(command.expression)
                }
            } else if(command.type == 'cycle') {
                //console.log(from, to)
            }
            else {
                var arguments = Object.keys(command)
                    .slice(1)
                    .reduce((arguments, argumentName, index) => {
                        arguments[argumentName] = eval(command[argumentName])
                        return arguments
                    }, {})

                var commandExecutor = functions[command.type]
                executeCommands.call(commandExecutor, commandExecutor.body, arguments)
            }
        })
    }

    var main = functions.main
    executeCommands.call(main, main.body, {})

    console.log(result)
}
/*
parseFunctions({
    main: {
        body: [
            {
                type: 'start',
                from: '5',
                to: '7'
            }
        ]
    },

    call: {
        body: [
            {
                type: 'argument',
                argumentIndex: '0'
            },

            {
                type: 'write',
                string: 'call '
            },

            {
                type: 'write',
                expression: 'functionIndex'
            },

            {
                type: 'write',
                string: '\n'
            }
        ]
    },

    argument: {
        body: [
            {
                type: 'write',
                string: 'push '
            },

            {
                type: 'write',
                expression: `1`
            },

            {
                type: 'write',
                string: '\n'
            }
        ]
    },

    add: {
        body: [
            {
                type: 'write',
                string: 'pop AX\n'
            },

            {
                type: 'write',
                string: 'pop BX\n'
            },

            {
                type: 'write',
                string: 'add AX, BX\n'
            },

            {
                type: 'write',
                string: 'push AX\n'
            }
        ]
    },

    start: {
        a: [
            {
                type: 'call',
                functionIndex: '1'
            }
        ],

        body: [
            {
                type: 'cycle',
                for: 'currentFunctionIndex',
                from: ''
            }
        ]
    }
})*/