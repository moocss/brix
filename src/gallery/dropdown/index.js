KISSY.add("brix/gallery/dropdown/index", function(S, Brick) {
    function Dropdown() {
        Dropdown.superclass.constructor.apply(this, arguments);
    }
    Dropdown.ATTRS = {
        mode:{
            value:1
        },
        autoResize:{
            value:true
        }
    }
    Dropdown.FIRES = {
        beforeFocus:'beforeFocus',
        focus:'focus',
        beforeBlur:'beforeBlur',
        blur:'blur',
        selected:'selected'
    }
    Dropdown.METHODS = {
        focus: function() {
            var mode = this.get('mode'),
                el = this.get('el');
            this.fire(Dropdown.FIRES.beforeFocus);
            if(mode==1){
                el.one('.dropdown-hd').addClass("dropdown-hd-active");
            }
            el.one('.dropdown-list').css({'display':'block'});
            if(this.get('autoResize')){
                var w = el.one('.dropdown-hd').outerWidth();
                el.one('.dropdown-list').css({width:w+'px'});  
            }
            this.fire(Dropdown.FIRES.focus);
        },
        blur: function() {
            var mode = this.get('mode'),
                el = this.get('el');
            this.fire(Dropdown.FIRES.beforeBlur);
            if(mode==1){
                el.one('.dropdown-hd').removeClass("dropdown-hd-active");
            }
            el.one('.dropdown-list').css('display', 'none');
            this.fire(Dropdown.FIRES.blur);
        }
    }

    Dropdown.DOCEVENTS = {
        "":{//空选择器，表示将事件直接绑定在document上
            click:function(e){
                var self = this,
                    el = self.get('el');
                if (!self.__show&&!el.contains(e.target)) {
                    el.all('.dropdown-list').css('display', 'none');
                    el.all('.dropdown-hd').removeClass("dropdown-hd-active");
                }
                self.__show = false;
            }
        }
    }
    Dropdown.EVENTS = {
        "":{
            mouseleave:function(){
                var mode = this.get('mode');
                if(mode!=1){
                    this.blur()
                }
            }
        },
        ".dropdown-hd": {
            click: function(e) {
                var mode = this.get('mode');
                if(mode==1){
                    el = this.get('el').one('.dropdown-list');
                    this.__show = true;
                    if (el.css('display') == 'block') {
                        this.blur();
                    } else {
                        this.focus();
                    }
                }
            },
            mouseenter:function(){
                var mode = this.get('mode');
                if(mode!=1){
                    this.focus()
                }
            }
        },
        ".dropdown-item": {
            click: function(e) {
                this.__show = true;
                this.blur();
                var el = this.get('el');
                var currentTarget = S.one(e.currentTarget);
                if(currentTarget.hasClass('dropdown-itemselected')){
                    return;
                }
                el.all('.dropdown-itemselected').removeClass('dropdown-itemselected');
                currentTarget.addClass('dropdown-itemselected');
                var dropdownTextNode = el.one('.dropdown-text');
                var selectNode = currentTarget.one('span');
                var data = {
                    value: selectNode.attr('value'),
                    text: selectNode.text()
                }


                //隐藏提交的表单字段，如果存在，赋值
                var inputNode = el.one('input');
                if(inputNode){
                    inputNode.val(data.value);
                }
                dropdownTextNode.attr('value', data.value);
                dropdownTextNode.text(data.text);
                this.fire(Dropdown.FIRES.selected, data);
            },
            mouseenter: function(e) {
                var currentTarget = S.one(e.currentTarget);
                currentTarget.addClass('dropdown-itemover');
            },
            mouseleave: function(e) {
                var currentTarget = S.one(e.currentTarget);
                currentTarget.removeClass('dropdown-itemover');
            }
        }
    };

    S.extend(Dropdown, Brick, {
    });

    S.augment(Dropdown,Dropdown.METHODS);
    return Dropdown;
}, {
    requires: ["brix/core/brick"]
});
