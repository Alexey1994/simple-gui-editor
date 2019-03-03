/*
var FieldEditorComponent = Component(
    [
        [TextComponent]
    ],

    ['value'],
    ['valueChange'],

    function (value, valueChange) {

    },

    function (value, valueChange) {
        //console.log(this)
        this.view[0].value = value
    }
)
*/

var ElementEditorComponent = Component(
    [
        [RectangleComponent, [
            [ListComponent]
        ]],

        [ScriptEditorComponent]
    ],

    ['element'],
    [],

    function(element) {
        var wrapper = this.view[0]
        wrapper.padding = '20px'
        var wrapperElement = this.view[0][0].element
        var wrapperStyle = wrapperElement.style

        wrapperStyle.backgroundColor = '#fff'

        var list = this.view[0][0][0]
        list.template = Component(
            [
                [GridComponent, [
                    [TextComponent],
                    [InputComponent]
                ]]
            ],

            ['value'],
            ['valueChange'],

            function (value, valueChange) {
                var grid = this.view[0]
                grid.columns = 'min-content auto'
                grid.gap = '10px'
            },

            function (value, valueChange) {
                this.view[0][0][0].value = value.inputName
                this.view[0][0][1].value = value.wrappedElement[value.inputName]

                this.view[0][0][1].valueChange = function(newValue) {
                    value.wrappedElement[value.inputName] = newValue
                }
            }
        )
    },

    function(element) {
        const wrappedElement = element[0][0][0]
        var list = this.view[0][0][0]
        list.items = wrappedElement.inputs.map(inputName => ({inputName, element, wrappedElement}))
    }
)