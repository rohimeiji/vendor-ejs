/* ================================
Wrapper
================================== */
Vue.component('wrapper', {
    template: `<div id="wrapper"><slot></slot></div>`,
});
/* ================================
Navbar
================================== */
Vue.component('navbar', {
    props: [],
    data: function(){
        return {
            user: this.$root.user,
        }
    },
    template: `
    <nav class="navbar navbar-default navbar-static-top m-b-0">
        <div class="navbar-header">
            <a class="navbar-toggle hidden-sm hidden-md hidden-lg " href="javascript:void(0)" data-toggle="collapse" data-target=".navbar-collapse">
                <i class="ti-menu"></i>
            </a>
            <div class="top-left-part">
                <a class="logo" :href="routes.bo_dashboard">
                    <img class="visible-xs" :src="assets('bo_images','logo.png')" alt="home" />
                    <span class="hidden-xs">
                        <img :src="assets('bo_images','logo-sm.png')" alt="home" />
                    </span>
                </a>
            </div>
            <ul class="nav navbar-top-links navbar-left hidden-xs">
                <li>
                    <a href="javascript:void(0)" class="open-close hidden-xs waves-effect waves-light">
                        <i class="icon-arrow-left-circle ti-menu"></i>
                    </a>
                </li>
            </ul>
            <ul class="nav navbar-top-links navbar-right pull-right">
                <li class="dropdown">
                    <a class="dropdown-toggle profile-pic" data-toggle="dropdown" href="#">
                        <img :src="user.bu_pic ? assets('users',user.bu_pic) : assets('bo_images','users/varun.jpg')" alt="user-img"
                            width="36" class="img-circle">
                        <b class="hidden-xs">{{ user.bu_real_name }}</b>
                    </a>
                    <ul class="dropdown-menu dropdown-user animated flipInY">
                        <li>
                            <a :href="routes.bo_profile"><i class="ti-user"></i> My Profile</a>
                        </li>
                        <li>
                            <a :href="routes.bo_dologout"><i class="fa fa-power-off"></i> Logout</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>`,
});
/* ================================
Sidebar
================================== */
Vue.component('sidebar', {
    props: [],
    data: function(){
        return {
            user: this.$root.user,
            menu: this.$root.menu,
            navparent: this.$root.navparent,
            navcurrent: this.$root.navcurrent,
            navchild: this.$root.navchild,
        }
    },
    template: `
    <div class="navbar-default sidebar" role="navigation">
        <div class="sidebar-nav navbar-collapse slimscrollsidebar">
            <ul class="nav" id="side-menu">
                <li class="sidebar-search hidden-sm hidden-md hidden-lg">
                    <div class="input-group custom-search-form">
                        <input type="text" class="form-control" placeholder="Search...">
                        <span class="input-group-btn">
                            <button class="btn btn-default" type="button"> <i class="fa fa-search"></i> </button>
                        </span>
                    </div>
                </li>
                <li class="user-pro">
                    <a href="#" class="waves-effect">
                        <img width="30" :src="user.bu_pic ? assets('users',user.bu_pic) : assets('bo_images','users/varun.jpg')" alt="user-img"  class="img-circle"> <span class="hide-menu">{{ user.bu_real_name }}<span class="fa arrow"></span></span>
                    </a>
                    <ul class="nav nav-second-level">
                        <li><a :href="routes.bo_profile"><i class="ti-user"></i> My Profile</a></li>
                        <li><a :href="routes.bo_dologout"><i class="fa fa-power-off"></i> Logout</a></li>
                    </ul>
                </li>
                <li v-for="(v,k) in menu" :class="{'nav-small-cap m-t-10':v.head,active:k==navparent}">
                    <span v-if="v.head">{{ v.head }}</span>
                    <a v-if="!v.child" :href="v.link" class="waves-effect"><i :class="v.icon"></i>&nbsp;&nbsp;<span class="hide-menu">{{ v.name }}</span></a>
                    <a v-if="v.child" :href="v.link" class="waves-effect"><i :class="v.icon"></i>&nbsp;&nbsp;<span class="hide-menu">{{ v.name }}<span class="fa arrow"></span></span></a>
                    <ul v-if="v.child" class="nav nav-second-level">
                        <li v-for="(v2,k2) in v.child">
                            <a :href="v2.link" :class="{active:k2==navcurrent}">{{ v2.name }} <span v-if="v2.child" class="fa arrow"></span></a>
                            <ul v-if="v2.child" class="nav nav-third-level collapse">
                                <li v-for="(v3,k3) in v2.child">
                                    <a :href="v3.link" :class="{active:k3==navchild}">{{ v3.name }}</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>`,
});
/* ================================
Field
================================== */
Vue.component('field', {
    props: {
        value: String,
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: "text"
        },
        placeholder: String,
        label: String,
        validate: {default:""},
        mandatory: Boolean,
        keypress: String,
        col: Number,
        collabel: Number,
        disabled: Boolean,
        readonly: Boolean,
        maxlength: Number,
    },
    template: `<div class="form-group">
                    <label :class="labelCol()">{{ labelName() }} <span v-if="mandatory" class="text-danger">*</span></label>
                    <div :class="inputCol()">
                    <slot><input :type="type" :name="name" :validate="validateAttr()" class="form-control" :placeholder="placeHolder()" :onkeypress="keypressFunc()" :disabled="disabled" :readonly="readonly" :maxlength="maxlength"></slot>
                    <slot name="help"></slot>
                    </div>
                </div>`,
    data: function(){
        return {
            input: "",
        }
    },
    mounted: function(){
        if (!this.$slots.default){
            this.input = $(this.$el).find('input')[0];
            $(this.input).keyup((e)=>{
                this.sendEvent(e, 'keyup');
            }).blur((e)=>{
                this.sendEvent(e, 'blur');
            }).change((e)=>{
                this.sendEvent(e, 'change');
            });
            if(this.value) $(this.input).val(this.value);
        }
    },
    methods: {
        validateAttr: function(){
            return this.mandatory ? this.validate.addRule("required") : this.validate || false
        },
        labelCol: function(){
            var col = this.collabel ? this.collabel : 2;
            return this.col ? 'col-sm-'+col+' control-label' : '';
        },
        inputCol: function(){
            return this.col ? 'col-sm-'+this.col : '';
        },
        labelName: function(){
            return this.label ? this.label : fields[this.name];
        },
        placeHolder: function(){
            return this.placeholder ? this.placeholder : this.labelName();
        },
        sendEvent: function (e, eventName) {
            this.$emit('input', e.target.value);
            this.$emit(eventName, e);
            $(e.target).valid()
        },
        keypressFunc: function(){
            return this.keypress ? 'return '+this.keypress+'(event)' : '';
        }
    },
    watch: {
        value: function(value){
            $(this.input).val(value);
        }
    }
});
/* ================================
Tags Input
================================== */
Vue.component('tagsinput', {
    props: ['name','value'],
    template: '<input :name="name" type="text">',
    mounted: function () {
        $(this.$el).val(this.value).tagsinput();
        $(this.$el).change((e) => {
            this.$emit('input', e.target.value);
            this.onEdit = true;
            $(e.target).valid()
            _delay(() => {
                this.onEdit = false
            }, 300);
        });
    },
    watch: {
        value: function (v) {
            if (this.onEdit) return;
            $(this.$el).tagsinput('removeAll');
            $(this.$el).tagsinput('add', v);
        }
    }
});
/* ================================
Radio
================================== */
Vue.component('radio', {
    props: {
        name: String,
        label: String,
        option: String,
        checked: String,
        value: String,
        validate: {default:""},
        disabled: Boolean,
    },
    template: '<label class="radio-inline p-0">\
                    <div class="radio radio-info">\
                        <input @click="check" type="radio" v-model="status" :validate="validate?validate:false" :name="name" :id="radioID()" :value="option" :disabled="disabled">\
                        <label :for="radioID()">{{label}}</label>\
                    </div>\
                </label>',
    data:function(){
        return {status:this.value}
    },
    mounted: function(){
    },
    methods: {
        check: function(e){
            this.$emit("input", e.target.value);
        },
        radioID:function(){
            return 'radio'+this._uid;
        }
    },
    watch: {
        value: function(value){
            this.status = value;
        }
    }
});

/* ================================
Checkbox
================================== */
Vue.component('checkbox', {
    props: {
        name: String,
        label: String,
        option: String,
        checked: {default:false},
        value: String,
        validate: {default:""},
        disabled: Boolean,
    },
    template: '<label class="checkbox-inline p-0">\
                    <div class="checkbox checkbox-info">\
                        <input type="checkbox" v-model="status" :name="name" :validate="validate" :id="radioID()" :value="option" :disabled="disabled">\
                        <label :for="radioID()">{{label}}</label>\
                    </div>\
                </label>',
    data:function(){
        return {status:this.value}
    },
    mounted: function(){        
        // this.status = this.checked
        // this.$emit("input", this.checked);
    },
    methods: {
        radioID:function(){
            return 'checkbox'+this._uid;
        }
    },
    watch: {
        status: function(v){
            this.$emit("input", v);
        },
        value: function(value){
            this.status = value;
        }
    },
});

/* ================================
Submit
================================== */
Vue.component('submit', {
    props: {
        label: {default:"Submit Form"},
        position: {default:"right"},
        large: {type:Boolean}
    },
    template: '<div :class="\'text-\'+position">\
                    <button type="submit" :class="size()" class="fcbtn btn btn-info btn-outline btn-1e btn-loading">{{label}}\
                        <i class="icon-arrow-right14 position-right"></i>\
                    </button>\
                </div>',
    methods: {
        size: function(){
            return this.large ? "btn-lg" : "";
        }
    }
});
/* ================================
Modal
================================== */
Vue.component('modal', {
    props: {
        name: {required:true},
        title: String,
        action: String,
        method: String,
        type: String,
        submitLabel: {default:"Submit"},
        cancelLabel: {default:"Cancel"},
        size: {default:"modal-md"},
    },
    template: `<div :id="'modal'+name" class="modal fade" role="dialog">
		<div class="modal-dialog" :class="size">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">{{title}}</h4>
                    <button type="button" class="close close_modal" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fa fa-times"></i></span>
                    </button>
				</div>
				<v-form v-bind="{action:action,method:method,type:type}" @resp="vFormResp">
					<div class="modal-body">
						<slot></slot>
					</div>
                    <div class="modal-footer">
                        <slot name="footer">
						<button v-if="submitLabel" type="submit" class="btn btn-info btn-loading">{{submitLabel}}</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{cancelLabel}}</button>
                        </slot>
					</div>
				</v-form>
			</div>
		</div>
    </div>`,
    mounted: function(){
        $('#modal'+this.name).on('hidden.bs.modal', ()=>{
            this.$emit("close", this)
        })
    },
    methods: {
        vFormResp: function(vform){
            if (this._events.resp) return this.$emit('resp', vform)
            vform.submit()
        }
    }
});
/* ================================
PreviewImage
================================== */
Vue.component('image-preview', {
    props: {
        title: {default:"Image Preview"},
        type: String,
        filename: { default: "" },
        src: String,
    },
    template: '<a :href="path()" class="btn btn-info" v-tooltip="title"><i class="ti-image"></i></a>',
    mounted: function(){
        plugins('fancybox');
        $(this.$el).fancybox();
    },
    methods:{
        path: function(){
            if(this.src) return this.src;
            return assets(this.type, this.filename);
        }
    }
});
/* ================================
Label Status
================================== */
Vue.component('label-status', {
    props: {
        data: {default: {}},
        status: {default:false},
        type: {default:"status"},
    },
    template: '<label :class="style()">{{v()?v().text:"-"}}</label>',
    methods:{
        v: function(){
            if(this.type=="pub"){
                return {
                    'E':{text:"Edited", style:"primary"},
                    'T':{text:"Inactive", style:"danger"},
                    'P':{text:"Published", style:"success"},
                    'D':{text:"Inactive", style:"warning"},
                }[this.status];
            }else if(this.data.aca_id){
                if(this.type=="cust-apply-contact"){
                    return {
                        'Y': { text: "Yes", style: "success" },
                        'N': { text: "No", style: "info" },
                    }[this.data.aca_accept_callback];
                }
                return {
                    'Y': { text: "Finish", style: "success" },
                    'N': { text: "In Apply", style: "info" },
                }[this.data.aca_is_finish];
            }else{
                return this.status ? {text:"Active",style:"success"} : {text:"Inactive",style:"warning"};
            }
        },
        style: function(){
            if(!this.v()) return "";
            return "label label-"+this.v().style+" no_radius";
        }
    }
});
/* ================================
Sparkline
================================== */
Vue.component('morris', {
    props: {
        type: { default:"area" },
        data: { default:[] },
        width: { default:"" },
        height: { default:"" },
        xkey: { default:"" },
        ykeys: { default:[] },
        labels: { default:[] },
        parseTime: { default:true },
        hoverCallback: Function,
    },
    template: `<div></div>`,
    mounted:function(){
        setTimeout(()=>{
            this.$emit('input', this);
            this.init();
        }, 500);
    },
    methods:{
        init: function () {
            this.options = {
                element: this.$el,
                data: this.data,
                xkey: this.xkey,
                ykeys: this.ykeys,
                labels: this.labels ? this.labels : this.ykeys,
                fillOpacity: 0.4,
                behaveLikeLine: true,
                smooth: false,
                hideHover: 'auto',
                resize: true,
                parseTime:this.parseTime,
                hoverCallback: this.hoverCallback,
            };
            $(this.$el).html("");
            if(this.width) $(this.$el).width(this.width);
            if (this.height) $(this.$el).height(this.height);
            switch (this.type) {
                case 'line': this.chart = Morris.Line(this.options); break;
                case 'bar': this.chart = Morris.Bar(this.options); break;
                default: this.chart = Morris.Area(this.options); break;
            }
        }
    },
    watch:{
        type: function(){ this.init(); },
        data: function(){ this.init(); },
    }
});
/* ================================
sortable
================================== */
Vue.component('sortable', {
    props: {
        options: {default:{}},
        param: {default:{}},
    },
    template: '<div><slot></slot></div>',
    mounted: function(){
        plugins('sortable');
        this.sortable = Sortable.create(this.getEl(), {
            onEnd: (e)=>{
                ids = [];
                $(this.getEl()).find('tr').each(function (k) {
                    ids[ids.length] = $(this).attr('data-id');
                });
                this.param.crud = 'sorting';
                this.param._token = _token;
                this.param.ids = ids;
                $.post(location.href, this.param);
            }
        });
        this.onEnabled(this.options.enabled);
    },
    methods: {
        getEl: function(){
            if(this.options.parent) return $(this.$el).find(this.options.parent)[0];
            return this.$el;
        },
        onEnabled: function(v){
            if(v){
                $(this.getEl()).addClass('sorting');
            }else{
                $(this.getEl()).removeClass("sorting");
            }
            this.sortable.option("disabled", !v);
        },
    },
    watch: {
        'options.enabled': function(v){
            this.onEnabled(v);
        }
    }
});