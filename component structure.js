function updateStructure() {
    structureEditor.structure = structure
}

var draggedStructureNode

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
                ]],
                ['afterNode', Rectangle]
            ]]
        ]]
    ],

    inputs: ['value'],
    outputs: ['valueChange'],

    init: function() {
        this.wrapper.width = '100%'

        this.nodeLayout.columns = 'min-content min-content'
        //this.nodeLayout.gap = '10px'

        this.textWrapper.marginTop = '2px'
        this.textWrapper.color = '#eee'

        this.textWrapper.element.draggable = true

        this.textWrapper.element.ondragstart = event => {
            //event.preventDefault()
            event.dataTransfer.setData('data', '') //JSON.stringify(this.value))
            draggedStructureNode = this.value
            console.log(draggedStructureNode)
            //console.log(event)
        }

        this.textWrapper.element.ondragend = event => {
            draggedStructureNode = undefined
        }

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

        this.afterNode.width = '100%'
        this.afterNode.height = '20px'

        this.afterNode.element.ondragenter = event => {
            event.returnValue = false
            event.preventDefault()
        }

        this.afterNode.element.ondragover = event => {
            event.returnValue = false
            event.preventDefault()
        }

        this.afterNode.element.ondrop = event => {
            event.stopPropagation()
            this.valueChange('insertAfter')
        }
    },

    change: {
        value: function(elemenetDescription) {
            this.name.value = `${elemenetDescription.name}: `
            this.text.value = elemenetDescription.element.self.wrappedComponent.name

            this.list.template = StructureTemplate
            this.list.items = elemenetDescription.innerStructureDescription
            
            this.list.itemChange = item => {
                //console.log(item)

                //destroyComponentView(draggedStructureNode.element)

                var dropStructureDescription = this.value.innerStructureDescription
                dropStructureDescription.splice(item.index + 1, 0, null)
                var parentStructureDescription = draggedStructureNode.parentStructureDescription || structure
                var indexInParentNode = parentStructureDescription.indexOf(draggedStructureNode)
                parentStructureDescription.splice(indexInParentNode, 1)
                draggedStructureNode.parentStructureDescription = dropStructureDescription
                dropStructureDescription.splice(dropStructureDescription.indexOf(null), 1, draggedStructureNode)

                var dropStructure = this.value.structure
                dropStructure.splice(item.index + 1, 0, null)
                var parentStructure = draggedStructureNode.parentStructure

                if(parentStructure)
                    parentStructure.splice(indexInParentNode, 1)
                else
                    destroyComponentView(draggedStructureNode.element)
                
                draggedStructureNode.parentStructure = dropStructure
                dropStructure.splice(dropStructure.indexOf(null), 1, [draggedStructureNode.component])
                //dropStructure.splice(dropStructure.indexOf(null), 1, [draggedStructureNode.name, draggedStructureNode.component, draggedStructureNode.structure])


                /*
                this.structure.splice(item.index + 1, 0, null)
                this.structure.splice(this.structure.indexOf(draggedStructureNode), 1)
                this.structure.splice(this.structure.indexOf(null), 1, draggedStructureNode)
                */
                updatePreview(previewRootElement)
                updateStructure()
            }
        }
    }
})

var ComponentStructure = AnonimComponent({
    name: 'ComponentStructure',

    structure: [
        [Scroll, [
            ['wrapper', Rectangle, [
                ['list', List]
            ]]
        ]]
    ],

    inputs: ['structure'],

    init: function() {
        this.wrapper.color = '#fff'
        this.wrapper.padding = '10px 0'
        this.wrapper.minWidth = '100%'
        this.wrapper.minHeight = '100%'
/*
        this.wrapper.element.ondragenter = event => {
            event.returnValue = false
            event.preventDefault()
        }

        this.wrapper.element.ondragover = event => {
            event.returnValue = false
            event.preventDefault()
        }

        this.wrapper.element.ondrop = event => {
            console.log(event)
        }
*/
        this.list.template = StructureTemplate
        this.list.itemChange = item => {
            if(draggedStructureNode.parentStructureDescription) {
                var nodeIndex = draggedStructureNode.parentStructureDescription.indexOf(draggedStructureNode)
                draggedStructureNode.parentStructureDescription.splice(nodeIndex, 1)
                //draggedStructureNode.parentStructure.splice(nodeIndex, 1)
                delete draggedStructureNode.parentStructureDescription
                delete draggedStructureNode.parentStructure

                this.structure.splice(item.index + 1, 0, draggedStructureNode)
            }
            else {
                this.structure.splice(item.index + 1, 0, null)
                this.structure.splice(this.structure.indexOf(draggedStructureNode), 1)
                this.structure.splice(this.structure.indexOf(null), 1, draggedStructureNode)
            }

            updatePreview(previewRootElement)
            updateStructure()
        }
    },

    change: {
        structure: function(structure) {
            this.list.items = structure
        }
    }
})