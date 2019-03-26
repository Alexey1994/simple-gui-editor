var ElementEditor = AnonimComponent({
    name: 'component-editor',
    
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
        this.wrapper.padding = '20px'
        this.wrapper.element.style.backgroundColor = '#fff'

        this.list.template = AnonimComponent({
            name: 'list-item',

            structure: [
                ['grid', GridComponent, [
                    ['inputName', TextComponent],
                    ['inputValue', InputComponent]
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