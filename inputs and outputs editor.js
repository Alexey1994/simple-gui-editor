var InputsAndOutputsEditor = AnonimComponent({
    name: 'InputsAndOutputsEditor',

    structure: [
        ['layout', Grid, [
            ['inputsLayout', Grid, [
                ['inputBlock', Rectangle, [
                    ['addInputButton', Button],
                    ['inputsList', List]
                ]]
            ]],

            ['outputsLayout', Grid, [
                ['outputBlock', Rectangle, [
                    ['addOutputButton', Button],
                    ['outputsList', List]
                ]]
            ]]
        ]]
    ],

    init: function() {
        this.layout.columns = 'min-content min-content'
        this.layout.rows = 'min-content'
        this.layout.gap = '8px'

        this.inputs = ['value']
        this.inputBlock.color = '#fff'
        this.addInputButton.text = 'Add input'

        this.inputsList.template = AnonimComponent({
            name: 'input-name-editor',

            structure: [
                [Rectangle, [
                    ['layout', Grid, [
                        ['input', Input],
                        ['deleteButton', Button]
                    ]]
                ]]
            ],

            inputs: ['value'],
            outputs: ['valueChange'],

            init: function() {
                this.layout.columns = 'auto min-content'

                this.input.valueChange = value => {
                    this.valueChange(value)

                    var t = changeScript[this.previouseValue]
                    delete changeScript[this.previouseValue]
                    changeScript[value] = t
                    this.previouseValue = value

                    if(changeScriptTab)
                        changeScriptTab.value = changeScript
                }

                this.deleteButton.text = 'delete'
                
                this.deleteButton.click = () => {
                    delete changeScript[this.value]

                    if(changeScriptTab)
                        changeScriptTab.value = changeScript

                    this.valueChange()
                }
            },

            change: {
                value: function(value) {
                    this.previouseValue = value
                    this.input.value = value
                }
            }
        })

        this.inputsList.items = this.inputs

        this.addInputButton.click = () => {
            var inputName = `input${generateId()}`
            this.inputs.push(inputName)
            this.inputsList.items = this.inputs

            this.inputsList.itemChange = item => {
                if(typeof item.data == 'undefined') {
                    this.inputs.splice(item.index, 1)
                    this.inputsList.items = this.inputs
                }
                else
                    this.inputs[item.index] = item.data
            }

            changeScript[inputName] = `// Change script`

            if(changeScriptTab)
                changeScriptTab.value = changeScript
        }

        this.outputs = ['valueChange']
        this.outputBlock.color = '#fff'
        this.addOutputButton.text = 'Add output'

        this.outputsList.template = AnonimComponent({
            name: 'output-name-editor-list-item',

            structure: [
                [Rectangle, [
                    ['layout', Grid, [
                        ['input', Input],
                        ['deleteButton', Button]
                    ]]
                ]]
            ],

            inputs: ['value'],
            outputs: ['valueChange'],

            init: function() {
                this.layout.columns = 'auto min-content'

                this.input.valueChange = value => {
                    this.valueChange(value)
                }

                this.deleteButton.text = 'delete'
                
                this.deleteButton.click = () => {
                    this.valueChange()
                }
            },

            change: {
                value: function(value) {
                    this.input.value = value
                }
            }
        })

        this.outputsList.items = this.outputs

        this.addOutputButton.click = () => {
            this.outputs.push('outputName')
            this.outputsList.items = this.outputs

            this.outputsList.itemChange = item => {
                if(typeof item.data == 'undefined') {
                    this.outputs.splice(item.index, 1)
                    this.outputsList.items = this.outputs
                }
                else
                    this.outputs[item.index] = item.data
            }
        }
    }
})