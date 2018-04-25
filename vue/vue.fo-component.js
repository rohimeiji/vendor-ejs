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
    },
    template: '<div :id="\'modal\'+name" class="modal fade" role="dialog">\
		<div class="modal-dialog">\
			<div class="modal-content">\
				<div class="modal-header">\
                    <h5 class="modal-title" id="exampleModalLabel">{{title}}</h5>\
                    <button type="button" class="close btn_position" data-dismiss="modal" aria-label="Close">\
                        <span aria-hidden="true"><i class="icon-line-cross"></i></span>\
                    </button>\
                </div>\
                <slot></slot>\
			</div>\
		</div>\
	</div>',
});
/* ================================
Bootstrap Select
================================== */
Vue.component('bs-select', {
    props: ['options', 'value', 'validate', 'object'],
    template: '<select><slot></slot><option v-for="(v,k) in options" :value="object?v[object[0]]:k">{{object?v[object[1]]:v}}</option></select>',
    mounted: function () {
        plugins('bs-select');
        $(this.$el).selectpicker({
                width:"100%",
            }).val(this.value)
            .trigger('change')
            // emit event on change.
            .on('change', (e) => {
                this.$emit('change', e)
                this.$emit('input', e.target.value)
                vValidate(this, e.target.value);
            });
        this.vf = cValidate(this);
    },
    watch: {
        options: function(v){
            setTimeout(()=>{ $(this.$el).selectpicker('refresh');},200);
        },
        value: function (value) {
            // update value
            $(this.$el).val(value);
            setTimeout(() => { $(this.$el).selectpicker('refresh'); }, 200);
            vValidate(this, value);
        }
    },
	destroyed:function(){
		dValidate(this);
	}
});
/* ================================
Ion Range Slider
================================== */
Vue.component('ionrangeslider', {
    props: {
        validate: String,
        value: Number,
        min:{default:0},
        max:{default:10},
        postfix:{default:false},
    },
    template: '<input type="text">',
    mounted: function () {
        $(this.$el).val(this.value).ionRangeSlider({
            min: this.min,
            max: this.max,
            postfix: this.postfix,
        }).change((e)=>{
            this.onEdit = true
            this.$emit('input', e.target.value)
            vValidate(this, e.target.value)
            setTimeout(()=>{ this.onEdit=false }, 300)
        });
        this.plugin = $(this.$el).data("ionRangeSlider");
        this.vf = cValidate(this);
    },
    watch: {
        min: function(v){ this.plugin.update({min:v}) },
        max: function(v){ this.plugin.update({max:v}) },
        value: function (v) {
            if(!this.onEdit) this.plugin.update({from:v})
            vValidate(this, v)
        }
    },
    destroyed: function () {
        dValidate(this);
    }
});