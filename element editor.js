var ElementEditorComponent = AnonimComponent(
    'component-editor',
    [
        ['wrapper', RectangleComponent, [
            ['list', ListComponent]
        ]],

        [RectangleComponent, [
            [GridComponent, [
                //[TextComponent]
            ]]
        ]],

        //[ScriptEditorComponent]
    ],

    ['element'],
    [],

    function() {

    },

    function() {
        this.wrapper.padding = '20px'
        this.wrapper.element.style.backgroundColor = '#fff'

        this.list.template = AnonimComponent(
            'list-item',
            [
                ['grid', GridComponent, [
                    ['inputName', TextComponent],
                    ['inputValue', InputComponent]
                ]]
            ],

            ['value'],
            ['valueChange'],

            function() {

            },

            function () {
                this.grid.columns = 'min-content auto'
                this.grid.gap = '10px'
            },

            function (name, value, valueChange) {
                this.inputName.value = value.inputName
                this.inputValue.value = JSON.stringify(value.wrappedElement[value.inputName])

                this.inputValue.valueChange = function(newValue) {
                    value.wrappedElement[value.inputName] = JSON.parse(newValue)
                }
            },

            function() {

            }
        )
    },

    function(name, value) {
        this.list.items = value.self.wrappedComponent.inputs.map(inputName => ({inputName, element: this.element, wrappedElement: value.self.wrappedComponent}))
    },

    function() {

    }
)