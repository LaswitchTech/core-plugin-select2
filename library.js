builder.add('inputs','select2', class extends builder.InputClass {

    _init(){

        // Execute Parent
        super._init();

        // Set Additional Properties
        this._properties.options = [];
        this._properties.parent = null;
        this._properties.multiple = false;
        this._properties.allowNew = false;
        this._properties.allowClear = false;
        this._properties.defaults = {
            theme: "bootstrap-5",
            width: 'auto',
        };
    }

    _input(){

        // Initialize options
        this._component.options = {};

        // Create Input
        const input = $(document.createElement('select')).attr({
            'id': this._component.id + '-input',
            'class': 'form-select',
            'name': this._properties.name,
            'autocomplete': this._properties.autocomplete,
        });

        // Configure Select2
        this._properties.defaults.tags = this._properties.allowNew;
        this._properties.defaults.allowClear = this._properties.allowClear;
        this._properties.defaults.placeholder = this._properties.placeholder || undefined;
        if(this._properties.parent !== null){
            this._properties.defaults.dropdownParent = this._properties.parent;
        }
        if(typeof this._properties.callback.format === 'function'){
            this._properties.defaults.templateResult = this._properties.callback.format;
        }

        // Return Input
        return input;
    }

    _extend(){
        // Runs during _create() and before insertion.
        // Fix name for multiple after base attributes were set.
        if (this._properties.multiple) {
            this._component.input.attr('multiple', true);
            this._component.input.attr('name', this._properties.name + '[]'); // role[]
        }

        // Add Options
        if(Array.isArray(this._properties.options)){
            for(const [key, option] of Object.entries(this._properties.options)){
                this.add(option.id, option.text);
            }
        }

        // Placeholder support for Select2: ensure an empty option exists
        if (this._properties.placeholder && !this._component.input.find('option[value=""]').length) {
            this._component.input.prepend('<option value=""></option>');
        }
    }

    _timeout(){

        // Execute Parent
        super._timeout();

        const $input = this._component.input;

        // Use closest modal as dropdown parent if present; otherwise, allow user-supplied parent
        const $modal = this._component.closest('.modal');
        if ($modal.length) {
            this._properties.defaults.dropdownParent = $modal;
        } else if (this._properties.parent) {
            // if a parent was explicitly provided
            this._properties.defaults.dropdownParent = $(this._properties.parent);
        }

        // Initialize Select2
        if (!$input.data('select2')) {
            $input.select2(this._properties.defaults);
        }
    }

    delete(id = null){
        if(id){
            if(typeof this._component.options[id] !== 'undefined'){
                this._component.options[id].remove();
                delete this._component.options[id];
            }
        } else {
            for(const [key, element] of Object.entries(this._component.options)){
                element.remove();
                delete this._component.options[key];
            }
        }
    }

    add(id,text){
        if(typeof this._component.options[id] === 'undefined'){
            this._component.options[id] = $(document.createElement('option')).attr('value',id).text(text).appendTo(this._component.input);
        }
    }
});
