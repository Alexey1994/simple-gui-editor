function addElementInListComponent(element, name) {
    element.draggable = true

    element.ondragstart = function(event) {
        event.dataTransfer.setData('data', name)
    }
}

var ElementsListComponent = Component(
    [
        [RectangleComponent, [
            [GridComponent, [
                [ButtonComponent],
                [GridComponent, [
                    [TextComponent]
                ]]
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

        var buttonElement = this.view[0][0][0][0][0][0].element
        addElementInListComponent(buttonElement, 'button')

        var textElement = this.view[0][0][0][0][1][0].element
        addElementInListComponent(textElement, 'text')
    },

    function() {

    }
)