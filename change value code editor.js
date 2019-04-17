var ChangeValueCodeEditor = AnonimComponent({
    structure: [
        //['wrapper', Rectangle, [
            ['changeScripts', List]
        //]]
    ],

    inputs: ['value'],
    outputs: ['valueChange'],

    init: function() {
        this.changeScripts.template = AnonimComponent({
            structure: [
                ['wrapper', Rectangle, [
                    ['layout', Grid, [
                        ['name', Text],
                        ['scriptWrapper' , Rectangle, [
                            ['script', CodeEditor]
                        ]]
                    ]]
                ]]
            ],

            inputs: ['value'],
            outputs: ['valueChange'],

            init: function() {
                this.wrapper.color = '#fff'
                this.wrapper.width = '100%'
                this.wrapper.margin = '0 0 20px 0'

                this.layout.columns = 'min-content auto'
                this.layout.gap = '20px'

                this.scriptWrapper.height = '100px'

                this.script.valueChange = newValue => {
                    this.valueChange(newValue)
                }
            },

            change: {
                'value': function(value) {
                    this.name.value = value[0]
                    this.script.value = value[1]
                }
            }
        })

        this.changeScripts.items = [
            ['value', 'asdsafsaf']
        ]

        this.changeScripts.itemChange = newValue => {
            this.value[Object.keys(this.value)[newValue.index]] = newValue.data
            this.valueChange(this.value)
        }
    },

    change: {
        'value': function(value) {
            this.changeScripts.items = Object.keys(value).map(inputName => [inputName, value[inputName]])
        }
    }
})