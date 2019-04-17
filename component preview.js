var structure = []
var selectedComponent

function componentViewHasInnerContent(componentView) {
    function nodeHasInnerContent(structureNode) {
        var name
        var component
        var innerContent

        if(typeof structureNode[0] == 'string') {
            name = structureNode[0]
            component = structureNode[1]
            innerContent = structureNode[2]
        }
        else {
            component = structureNode[0]
            innerContent = structureNode[1]
        }

        if(!component)
            return true
    }

    var structure = componentView.structure

    if(structure) 
        for(var structureNode of componentView.structure)
            if(nodeHasInnerContent(structureNode))
                return true

    return false
}

var highlightedPreview

function createElementWrapper(parentElement, currentStructure, parentStructureDescription, component, componentDescription) {
    var ElementPreviewNode = AnonimComponent({
        name: 'element-preview-node',

        structure: [
            ['wrapper', Rectangle, [
                ['wrappedComponent', component, currentStructure]
            ]]
        ],

        init: function() {
            this.wrapper.element.style.display = 'inline'

            this.wrappedComponent.inputs.forEach(input => {
                if(input in componentDescription.inputs)
                    this.wrappedComponent[input] = componentDescription.inputs[input]
            })

            componentDescription.element = this.root

            this.wrapper.element.ondrop = event => {
                event.stopPropagation()

                var elementType = event.dataTransfer.getData('data')
                var elementIndex = parseInt(elementType)
                var droppedComponent = components[elementIndex]

                var innerStructureDescription = []

                var droppedDescription = {
                    name: generateId(), //undefined,
                    element: this.root,
                    innerStructureDescription,
                    inputs: {},
                    structure: [],
                    parentStructureDescription,
                    parentStructure: currentStructure
                }

                parentStructureDescription.push(droppedDescription)

                currentStructure.push([createElementWrapper(parentElement, droppedDescription.structure, innerStructureDescription, droppedComponent, droppedDescription)])
                updatePreview(parentElement)
                updateStructure()
            }

            this.wrapper.element.onclick = event => {
                event.stopPropagation()

                if(this.elementEditor) {
                    destroyComponentView(this.elementEditor)
                    this.elementEditor = undefined
                    return
                }

                this.elementEditor = ElementEditor(this.wrapper.element)
                this.elementEditor.componentDescription = componentDescription

                selectedComponentDescription = componentDescription

                if(elementEditor)
                    elementEditor.componentDescription = selectedComponentDescription
            }

            this.wrapper.element.onmousemove = (event) => {
                event.stopPropagation()

                if(highlightedPreview)
                    highlightedPreview.element.style.outline = 'none'

                highlightedPreview = this.wrapper
                this.wrapper.element.style.outline = '1px solid #000'
            }

            this.wrapper.element.onmouseleave = (event) => {
                event.stopPropagation()

                if(this.wrapper == highlightedPreview)
                    highlightedPreview = undefined

                this.wrapper.element.style.outline = 'none'
            }

            this.deleteFromStructure = function() {
                console.log(parentStructureDescription)
            }
        }
    })

    return ElementPreviewNode
}

var previewRootElement

function updatePreview(rootElement) {
    structure.forEach(node => {
        if(node.element)
            destroyComponentView(node.element)

        node.component(rootElement, node.structure)
    })

    if(elementEditor && selectedComponentDescription)
        elementEditor.componentDescription = selectedComponentDescription
}

var ComponentPreview = AnonimComponent({
    name: 'ComponentPreview',

    create: function() {
        this.element = document.createElement('div')
        previewRootElement = this.element
        this.parentElement.appendChild(this.element)
    },

    init: function() {
        this.element.style.height = '100%'

        this.element.ondragenter = function(event) {
            event.returnValue = false
            event.preventDefault()
        }

        this.element.ondragover = function(event) {
            event.returnValue = false
            event.preventDefault()
        }

        this.element.ondrop = event => {
            var elementType = event.dataTransfer.getData('data')
            var elementIndex = parseInt(elementType)
            var droppedComponent = components[elementIndex]

            var innerStructure = []
            var innerStructureDescription = []

            var componentDescription = {
                name: generateId(),
                component: undefined,
                element: undefined,
                structure: [],
                innerStructureDescription: [],
                inputs: {}
            }

            componentDescription.component = createElementWrapper(this.element, componentDescription.structure, componentDescription.innerStructureDescription, droppedComponent, componentDescription)
            structure.push(componentDescription)

            updatePreview(this.element)
            updateStructure()
        }
    },

    destroy: function() {
        this.parentElement.removeChild(this.element)
    }
})