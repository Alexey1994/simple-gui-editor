var ElementEditor = AnonimComponent({
    name: 'ElementEditor',
    
    structure: [
        ['wrapper', Rectangle, [
            ['list', List]
        ]],

        [Rectangle, [
            [Grid, [
                //[TextComponent]
            ]]
        ]],

        //[ScriptEditorComponent]
    ],

    inputs: ['element'],

    init: function() {
        this.wrapper.padding = '10px 0'
        this.wrapper.color = '#cacaca'
        this.wrapper.width = '100%'

        this.list.template = AnonimComponent({
            name: 'element-input-list-item',

            structure: [
                ['grid', Grid, [
                    ['inputName', Text],
                    ['inputValue', Input]
                ]]
            ],

            inputs: ['value'],
            outputs: ['valueChange'],

            init: function () {
                this.grid.columns = 'min-content auto'
                this.grid.gap = '10px'
            },

            change: {
                value: function(value) {
                    this.inputName.value = value.inputName
                    this.inputValue.value = JSON.stringify(value.wrappedElement[value.inputName])

                    this.inputValue.valueChange = function(newValue) {
                        value.wrappedElement[value.inputName] = JSON.parse(newValue)
                    }
                }
            }
        })
    },

    change: {
        element: function(element) {
            this.list.items = element.self.wrappedComponent.inputs.map(inputName => ({inputName, element: this.element, wrappedElement: element.self.wrappedComponent}))
        }
    }
})