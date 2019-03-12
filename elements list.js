function addElementInListComponent(element, name) {
    element.draggable = true

    element.ondragstart = function(event) {
        event.dataTransfer.setData('data', name)
    }
}

var ElementsListComponent = AnonimComponent(
    [
        [RectangleComponent, [
            [GridComponent, [
                /*[ButtonComponent],
                [GridComponent, [
                    [TextComponent]
                ]]*/
            ]]
        ]]
    ],

    [],
    [],

    function() {
        var wrapper = this.view[0]
        wrapper.padding = '20px'

        var wrapperElement = wrapper[0].element
        var wrapperStyle = wrapperElement.style
        wrapperStyle.backgroundColor = '#fff'

        var grid = this.view[0][0][0]
        grid.columns = '100px'
/*
        var buttonElement = this.view[0][0][0][0][0][0].element
        addElementInListComponent(buttonElement, 'button')

        var textElement = this.view[0][0][0][0][1][0].element
        addElementInListComponent(textElement, 'text')*/

        var elementsParent = this.view[0][0][0][0].parent

        components.forEach((component, index) => {
            var elementWrapperComponent = AnonimComponent(
                [
                    [GridComponent]
                ],

                [],
                [],

                function() {
                    var element = this.view[0][0].element
                    var style = element.style
                    style.minHeight = '20px'
                    style.border = '1px solid rgba(0, 0, 0, 0)'

                    element.onmouseenter = function() {
                        style.border = '1px solid #000'
                    }

                    element.onmouseleave = function() {
                        style.border = '1px solid rgba(0, 0, 0, 0)'
                    }

                    addElementInListComponent(element, index)
                    component(element, [])
                },

                function() {

                }
            )

            elementWrapperComponent(elementsParent)
        })
    },

    function() {

    }
)