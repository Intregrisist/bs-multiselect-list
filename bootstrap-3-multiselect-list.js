+function ($) {
    'use strict';

    // MULTISELECT PUBLIC CLASS DEFINITION
    // ===============================
    var MultiselectList = function (element, options) {
        this.$container = null;
        this.$element   = null;
        this.options    =

        this.init(element, options);
    };

    MultiselectList.DEFAULTS = {
        listTitle: 'Available',
        selectedTitle: 'Selected',
        btnText: 'Add',
        boxHeight: 184
    };

    MultiselectList.prototype.init = function (element, options) {
        this.$container = null;
        this.$element = $(element);
        this.$contAvailable = null;
        this.$contSelected = null;
        this.$selAvailable = null;
        this.$listSelected = null

        this.$element.prop('multiple','multiple');

        this.options = this.getOptions(options);

        this.render();
    };

    MultiselectList.prototype.render = function() {
        var oThis = this;

        // Render the Container and hide the original input
        this.$element.hide();
        this.$element.wrap('<div class="bs-multiselect-list row"/>');
        this.$container = this.$element.parent('.bs-multiselect-list');
        this.$contAvailable = $('<div class="col-sm-6"></div>');
        this.$contSelected = $('<div class="col-sm-6"></div>');
        this.$btnAdd = $('<button class="btn btn-default">'+this.options.btnText+'</button>');

        // Selected List
        this.$listSelected = $('<ul class="list-group"/>');
        this.$listSelected.css('max-height', this.options.boxHeight+'px');
        this.$listSelected.css('overflow-y', 'auto');

        // Select element for available options
        this.$selAvailable = $('<select class="form-control" size="10"/>');
        this.$selAvailable.height(this.options.boxHeight);

        // Build the left side
        this.$contAvailable.append('<h4>'+this.options.listTitle+'</h4>');
        this.$contAvailable.append(this.$selAvailable);
        this.$selAvailable.wrap('<div class="form-group" />');
        this.$contAvailable.append(this.$btnAdd);

        this.$container.append(this.$contAvailable);

        // Build the right side
        this.$contSelected.append('<h4>'+this.options.selectedTitle+'</h4>');
        this.$contSelected.append(this.$listSelected);
        this.$container.append(this.$contSelected);

        // Load initial list
        this.renderSelected();

        // Bind Events
        this.$btnAdd.on('click', function(e) {
            e.preventDefault();
            oThis.select();
        });
    }

    MultiselectList.prototype.select = function(val) {
        var $option;
        if(val) {
            $option = this.$selAvailable.find('option[value="'+val+'"]');
        }else{
            $option = this.$selAvailable.find('option:selected');
        }

        if($option.length <= 0) {
            return false;
        }

        var e = $.Event('selected.bs.multiselectlist', {
            value: $option.attr('value'),
            text: $option.text
        });

        this.$element.find('option[value="'+$option.attr('value')+'"]').prop('selected','selected');
        $option.prop('selected', false);
        this.$element.trigger('change').trigger(e);
        this.renderSelected();

        $option.hide();
    };

    MultiselectList.prototype.renderSelected = function() {
        var oThis = this,
            noOptionSelected = true;
        oThis.$listSelected.empty();
        oThis.$selAvailable.empty();

        this.$element.find('option').each(function(){
            var $option = $(this),
                $aOption = oThis.$selAvailable.find('option[value="'+$option.attr('value')+'"]');

            if($option.prop('selected')) {
                noOptionSelected = false;
                $aOption.prop('selected', false).hide();
                var $li = $('<li/>', {
                        class: 'list-group-item',
                        val: $option.attr('value'),
                        text: $option.text(),
                        title: $option.attr('title')
                    }),
                    $aRemove = $('<a href="#" class="pull-right"><i class="glyphicon glyphicon-remove"></i></a>');

                $aRemove.data('value', $option.attr('value'));

                $aRemove.on('click', function(e){
                    e.preventDefault();
                    oThis.unselect($option.attr('value'));
                });

                $li.append($aRemove);

                oThis.$listSelected.append($li);
            }else {
                var $nOption = $('<option>', {
                    value: $option.attr('value'),
                    text: $option.text()
                });

                $nOption.on('dblclick', function() {
                    var $option = $(this);
                    oThis.select($option.attr('val'));
                });

                oThis.$selAvailable.append($nOption);
            }
        });

        if(noOptionSelected) {
            var $li = $('<li/>', {
                    class: 'list-group-item alert-info',
                    text: 'No Items Selected.'
                });
            oThis.$listSelected.append($li);
        }
    };

    MultiselectList.prototype.unselect = function(value) {
        if(value) {
            var $option = this.$element.find('option[value="'+value+'"]');
            if($option.length >= 0) {
                var e = $.Event('unselected.bs.multiselectlist', {
                    value: $option.attr('value'),
                    text: $option.text
                });

                $option.prop('selected', false);
                this.$element.trigger('change').trigger(e);
                this.renderSelected();
                return true;
            }
        }

        return false;
    }

    MultiselectList.prototype.getDefaults = function () {
        return MultiselectList.DEFAULTS
    }

    MultiselectList.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);
        return options;
    }

    // MULTISELECT LIST PLUGIN DEFINITION
    // =========================

    var old = $.fn.multiselectlist;

    $.fn.multiselectlist = function (option, callback) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.multiselectlist')
            var options = typeof option == 'object' && option

            if (!data && option == 'destroy') return
            if (!data) $this.data('bs.multiselectlist', (data = new MultiselectList(this, options)))

            if(option == 'update') {
                data.renderSelected()
            }else if(typeof option == 'string') {
                data[option]()
            }
        })
    };

    $.fn.multiselectlist.Constructor = MultiselectList;


    // MULTISELECT LIST NO CONFLICT
    // ===================

    $.fn.multiselectlist.noConflict = function () {
        $.fn.multiselectlist = old;
        return this;
    }

    // MULTISELECT DATA-API
    // =================

    $(window).on('load', function () {
        $('select[data-toggle="multiselectlist"]').each(function () {
            var $multiselectlist = $(this);
            $multiselectlist.multiselectlist($multiselectlist.data());
        })
    })
}(jQuery);