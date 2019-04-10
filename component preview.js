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

function createElementWrapper(parentElement, parentStructure, parentStructureDescription, component) {
    var ElementPreviewNode = AnonimComponent({
        name: 'element-preview-node',

        structure: [
            ['wrapper', Rectangle, [
                ['wrappedComponent', component, parentStructure]
            ]]
        ],

        init: function() {
            this.wrapper.element.style.display = 'inline'

            //console.log(componentViewHasInnerContent(this.root))

            this.wrapper.element.ondrop = event => {
                event.stopPropagation()

                var elementType = event.dataTransfer.getData('data')
                var elementIndex = parseInt(elementType)
                var droppedComponent = components[elementIndex]

                var innerStructureDescription = []

                parentStructureDescription.push({
                    element: this.root,
                    innerStructureDescription
                })

                parentStructure.push([createElementWrapper(parentElement, [], innerStructureDescription, droppedComponent)])
                updatePreview(parentElement)
            }

            this.wrapper.element.onclick = event => {
                event.stopPropagation()

                selectedComponent = this.root
                //console.log(this)
                if(elementEditor)
                    elementEditor.element = this.root
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

function updatePreview(rootElement) {
    structure.forEach(node => {
        if(node.element)
            destroyComponentView(node.element)

        node.element = node.component(rootElement, node.structure)
    })
}

var ComponentPreview = AnonimComponent({
    name: 'ComponentPreview',

    create: function() {
        this.element = document.createElement('div')
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

            structure.push({
                component: createElementWrapper(this.element, innerStructure, innerStructureDescription, droppedComponent),//droppedComponent,
                element: undefined,
                structure: innerStructure,
                innerStructureDescription
            })

            updatePreview(this.element)
        }
    },

    destroy: function() {
        this.parentElement.removeChild(this.element)
    }
})