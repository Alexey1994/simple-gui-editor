function addElementInListComponent(element, data) {
    element.draggable = true

    element.ondragstart = function(event) {
        event.dataTransfer.setData('data', data)
    }
}

var ElementsListComponent = AnonimComponent(
    'elements-list',
    [
        ['wrapper', RectangleComponent, [
            ['grid', GridComponent, [

            ]]
        ]]
    ],

    [],
    [],

    function() {

    },

    function() {
        this.wrapper.padding = '20px'

        var wrapperStyle = this.wrapper.element.style
        wrapperStyle.backgroundColor = '#fff'

        this.grid.columns = 'min-content'
        this.grid.gap = '8px'

        var elementsParent = this.grid.element

        components.forEach((component, index) => {
            var elementWrapperComponent = AnonimComponent(
                'element',
                [
                    ['wrapper', GridComponent]
                ],

                [],
                [],

                function() {

                },

                function() {
                    this.wrapper.columns = 'auto 100px'
                    this.wrapper.gap = '8px'

                    var element = this.wrapper.element //this.view[0][0].element
                    var style = element.style
                    style.minHeight = '20px'
                    style.border = '1px solid rgba(0, 0, 0, 0)'
                    style.whiteSpace = 'nowrap'

                    element.onmouseenter = function() {
                        style.border = '1px solid #000'
                    }

                    element.onmouseleave = function() {
                        style.border = '1px solid rgba(0, 0, 0, 0)'
                    }

                    var elementPreview = document.createElement('div')
                    element.appendChild(elementPreview)
                    var drawedComponent = component(elementPreview, [])
                    var italic = document.createElement('i')
                    italic.innerHTML = drawedComponent.name
                    element.appendChild(italic)
                    addElementInListComponent(element, index)
                },

                function() {

                },

                function() {

                }
            )

            elementWrapperComponent(elementsParent)
        })
    },

    function() {

    },

    function() {

    }
)