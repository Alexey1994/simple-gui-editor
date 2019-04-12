var ElementEditor = AnonimComponent({
    name: 'ElementEditor',
    
    structure: [
        ['wrapper', Rectangle, [
            ['nameEditorLayout', Grid, [
                ['nameEditorName', Text],
                ['nameEditorValue', Input]
            ]],
            ['list', List]
        ]],

        [Rectangle, [
            [Grid, [
                //[TextComponent]
            ]]
        ]],

        //[ScriptEditorComponent]
    ],

    inputs: ['componentDescription'],

    init: function() {
        this.wrapper.padding = '10px 0'
        this.wrapper.color = '#cacaca'
        this.wrapper.width = '100%'

        this.nameEditorLayout.columns = 'min-content auto'
        this.nameEditorLayout.gap = '10px'

        this.nameEditorName.value = 'name'
        this.nameEditorValue.valueChange = newName => {
            if(this.componentDescription)
                this.componentDescription.name = newName
        }

        var editor = this

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
                        editor.componentDescription.inputs[value.inputName] = JSON.parse(newValue)
                    }
                }
            }
        })
    },

    change: {
        componentDescription: function(componentDescription) {
            this.nameEditorValue.value = componentDescription.name
            this.list.items = componentDescription.element.self.wrappedComponent.inputs.map(inputName => ({inputName, element: this.element, wrappedElement: componentDescription.element.self.wrappedComponent}))
        }
    }
})