components.createLayer = function(layerEl, layerProps, changeCallback, additionals = {}) {
    htmlUtils.removeChilds(layerEl);

    if(layerProps == undefined) {
        changeCallback();
        return;
    }

    layerEl.appendChild(htmlUtils.createElement('div', { text: 'id: ' + layerProps.id }))
    layerEl.appendChild(components.createInput(layerProps.name, 'Name: ', function(value) {
        if(value){
            layerProps.name = value
            if(additionals.selectedOption)
                additionals.selectedOption.text =  value;

            changeCallback();
        }
    }, function(value) {
        if(!additionals.nameChangeValidation(value)){
            notifications.error('Layer name already exists', 2000)
            return false;
        }

        return true;
    }))

    let layerVisiblityEl = components.createCheckBox(layerProps.visible, 'Visible', function(value) {
        layerProps.removeImage();
        layerProps.visible = value;
        changeCallback();
    })

    layerEl.appendChild(layerVisiblityEl);

    components.editor.editor.toggleLayerVisibility = () => layerVisiblityEl.chk.click();
    components.editor.editor.toggleGroupVisibility = undefined;

    layerProps.groupsEl = htmlUtils.createElement('div', { className: 'groupsListWrapper' });
    layerProps.groupEl = htmlUtils.createElement('div', { className: 'group'});
    layerEl.appendChild(layerProps.groupsEl);
    layerEl.appendChild(layerProps.groupEl);

    this.fillGroups(layerProps, changeCallback) 

    changeCallback();
}