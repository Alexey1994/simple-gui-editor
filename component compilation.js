/*
var Text = Component(
    null,

    ['value'],
    [],

    function() {
        this.element = document.createTextNode('')
        this.parentElement.appendChild(this.element)
    },

    function() {

    },

    function(name, value) {
        this.element.data = value
    },

    function() {
        this.parentElement.removeChild(this.element)
    }
)

var t = Text(document.body)
*/
/////////////////////////////////////////////////////////////

function Text(parentElement, innerComponents) {
    var self = {
        element: undefined,
        parentElement,
        
        //onChange
        onChange: function(name, value) {
            self.element.data = value
        },

        //onDelete
        onDelete: function() {
            self.parentElement.removeChild(self.element)
        },

        set_value: function(newValue) {
            self.value = newValue
            self.onChange('value', newValue)
        }
    }

    //constructor
    self.element = document.createTextNode('')
    self.parentElement.appendChild(self.element)

    //inner components

    //init

    return self
}

var t = Text(document.body)
t.set_value('Hi')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var q = {
    set r (t){}
}

/////////////////////////////////////////////////////////////

