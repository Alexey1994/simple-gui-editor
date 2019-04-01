var ComponentStructure = AnonimComponent({
    name: 'ComponentStructure',

    structure: [
        ['wrapper', Rectangle, [
            ['list', List]
        ]]
    ],

    inputs: ['structure'],

    init: function() {
        this.wrapper.color = '#cacaca'
        this.wrapper.padding = '10px 0'
        this.wrapper.width = '100%'

        this.list.template = AnonimComponent({
            name: 'component-structure-node',

            structure: [
                ['wrapper', Rectangle, [
                    ['text', Text]
                ]]
            ],

            inputs: ['value'],
            outputs: ['valueChange'],

            init: function() {
                this.wrapper.color = '#eee'
                this.wrapper.width = '100%'
                this.wrapper.margin = '2px 0'
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
            this.list.items = structure.map(elemenetDescription => elemenetDescription.element)
        }
    }
})