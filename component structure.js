var ComponentStructure = AnonimComponent({
    name: 'component-structure',

    structure: [
        ['wrapper', Rectangle, [
            ['list', List]
        ]]
    ],

    inputs: ['structure'],

    init: function() {
        this.list.template = AnonimComponent({
            name: 'component-structure-node',

            structure: [
                ['wrapper', RectangleComponent, [
                    ['text', TextComponent]
                ]]
            ],

            inputs: ['value'],
            outputs: ['valueChange'],

            init: function() {
                this.wrapper.color = '#fff'
            },

            change: {
                value: function(value) {
                    this.text.value = value.self.wrappedComponent.name
                }
            }
        })
    },

    change: {
        structure: function(structure) {
            this.list.items = structure
        }
    }
})