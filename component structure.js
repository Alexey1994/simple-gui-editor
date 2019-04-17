function updateStructure() {
    structureEditor.structure = structure
}

var StructureTemplate = AnonimComponent({
    name: 'component-structure-node',

    structure: [
        ['wrapper', Rectangle, [
            ['nodeLayout', Grid, [
                [Rectangle, [
                    ['textWrapper', Rectangle, [
                        ['name', Text],
                        ['text', Text],
                        ['deleteButton', Button]
                    ]],
                ]],
                [Rectangle, [
                    ['list', List]
                ]]
            ]]
        ]]
    ],

    inputs: ['value'],
    outputs: ['valueChange'],

    init: function() {
        this.wrapper.width = '100%'

        this.nodeLayout.columns = 'min-content min-content'
        this.nodeLayout.gap = '10px'

        this.textWrapper.marginTop = '2px'
        this.textWrapper.color = '#eee'

        this.textWrapper.element.onclick = event => {
            event.stopPropagation()

            if(this.elementEditor) {
                destroyComponentView(this.elementEditor)
                this.elementEditor = undefined
                return
            }

            this.elementEditor = ElementEditor(this.textWrapper.element)
            this.elementEditor.componentDescription = this.value
        }

        this.deleteButton.text = 'delete'
        this.deleteButton.click = () => {
            if(this.value.parentStructureDescription) {
                var index = this.value.parentStructureDescription.indexOf(this.value)
                this.value.parentStructure.splice(index, 1)
                this.value.parentStructureDescription.splice(index, 1)
                updatePreview(previewRootElement)                
            }
            else {
                var index = structure.indexOf(this.value)
                destroyComponentView(this.value.element)
                structure.splice(index, 1)
                updatePreview(previewRootElement)
            }

            updateStructure()
        }
    },

    change: {
        value: function(elemenetDescription) {
            this.name.value = `${elemenetDescription.name}: `
            this.text.value = elemenetDescription.element.self.wrappedComponent.name

            this.list.template = StructureTemplate
            this.list.items = elemenetDescription.innerStructureDescription
        }
    }
})

var ComponentStructure = AnonimComponent({
    name: 'ComponentStructure',

    structure: [
        ['wrapper', Scroll, [
            ['list', List]
        ]]
    ],

    inputs: ['structure'],

    init: function() {
        this.wrapper.color = '#cacaca'
        this.wrapper.padding = '10px 0'
        this.wrapper.width = '300px'

        this.list.template = StructureTemplate
    },

    change: {
        structure: function(structure) {
            this.list.items = structure
        }
    }
})