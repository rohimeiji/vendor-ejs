Vue.component('loading-spinner', {
	template: '<div class="loading-spinner" :class="{light:light}"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
	props: ['light'],
});
Vue.component('v-pagination', {
	template: '<ul class="pagination" v-if="max_page>1">\
		<li :class="{disabled:page<=1}">\
			<span v-if="page<=1">«</span>\
			<a v-else href="javascript:;" @click="link(page-1)">«</a>\
		</li>\
		<li v-for="(v,k) in pages" :class="{disabled:(v<1||v>max_page),active:v==page}" v-if="v>0&&v<=max_page">\
			<a href="javascript:;" @click="link(v)">{{ v }}</a>\
		</li>\
		<li :class="{disabled:page>=max_page}">\
			<span v-if="page>=max_page">»</span>\
			<a v-else href="javascript:;" @click="link(page+1)">»</a>\
		</li>\
	</ul>',
	data: function () {
		return {
			pages: [],
		}
	},
	mounted: function () {
		for (i = 0; i < 7; i++) {
			this.pages.push(this.page - 3 + i);
		}
	},
	props: {
		'page': Number,
		'max_page': Number,
	},
	methods: {
		link: function (page) {
			filter.page = page;
			this.$emit("click", {
				link: location.origin + location.pathname + "?" + objSerialize(filter),
				filter: filter,
			});
		}
	}
});
Vue.component('select2', {
	props: ['options', 'value', 'object', 'withAdd'],
	template: '<select><slot></slot>\
				<slot name="add_new" v-if="withAdd"><option value="add">Add New</option></slot>\
				<slot name="item" :data="options"><option v-for="(v,k) in options" :value="object?v[object[0]]:k">{{optValue(v)}}</option></slot>\
			   </select>',
	mounted: function () {
		plugins('select2');
		$(this.$el)
			// init select2
			.select2({
				dropdownCssClass: this.withAdd ? "with-add" : "",
			})
			.val(this.value)
			.trigger('change')
			// emit event on change.
			.on('change', (resp) => {
				this.$emit('change', resp)
				this.$emit('input', resp.val)
				$(resp.target).valid()
			});
	},
	methods:{
		optValue: function(v){
			if(this.object){
				obj = this.object[1].split("+");
				if(obj[1]) return v[obj[0]]+" "+v[obj[1]];
			}
			return this.object?v[this.object[1]]:v
		}
	},
	watch: {
		value: function (value) {
			// update value
			$(this.$el).val(value).select2({
				dropdownCssClass: this.withAdd ? "with-add" : "",
			});
			setTimeout(() => { $(this.$el).val(value).select2(); }, 100);
		}
	}
});
Vue.component('datepicker', {
	props: ['value'],
	template: '<input type="text" class="form-control">',
	mounted: function () {
		plugins('bs-datepicker');
		$(this.$el).datepicker({
			todayHighlight: true,
			autoclose: true
		}).change((e)=>{
			this.$emit('input', e.target.value)
			$(e.target).valid()
		});
	},
	watch: {
		value: function (value) {
			$(this.$el).datepicker("update", value)
		}
	}
});
Vue.component('ckeditor', {
	props: ['name', 'value'],
	template: '<textarea :name="name" :id="name"></textarea>',
	mounted: function () {
		if(this.value) this.$el.value = this.value;
		this.ck = CKEDITOR.replace(this.name, {
			height: '400px',
			extraPlugins: 'forms',
			allowedContent: true,
			filebrowserUploadUrl: base_url+'/ajax/upload?pageType=editor&_token=' + _token,
		});
		this.ck.on('change', () => {
			this.$emit('input', this.ck.getData());
			this.onEdit = true;
			this.$el.value = this.ck.getData();
			_delay(() => {
				this.onEdit = false
			}, 300);
		});
		ck = this.ck;
	},
	watch: {
		value: function (v) {
			if (!this.onEdit){
				this.ck.setData(v);
			}
		}
	}
});
Vue.component('v-form', {
	props: {
		target: {
			default: ".table-loading"
		},
		method: {
			default: "get"
		},
		type: {
			default: "ajax"
		},
		action: {
			default: "",
		},
		data: {
			default: "",
		}
	},
	template: '<form :data-vv-scope="formName"><slot></slot></form>',
	data: function () {
		_vue.form.push(this);
		return {
			formName: "form_" + _vue.form.length,
		}
	},
	mounted:function(){
		$.validator.setDefaults({ 
			ignore: ".nv",
		})
		$.validator.setDefaults({
			errorPlacement: function (error, element) {
				var placement = $("[error='" + element.attr('name') + "']")
				var label = placement.attr('label') || element.attr('name')
				error.text(error.text().replace("{label}", label))
				if (placement.length) {
					placement.html(error)
				} else {
					error.insertAfter(element);
				}
			},
		})
		$("form").validate()
		$(this.$el).submit((e)=>{
			$('[validate]').each(function(){
				if(!$(this).is('input,textarea,select')) return;
				var rules = [], t = []
				$(this).attr('validate').split("|").forEach((v)=>{
					ex = v.split(":")
					if(!ex[0]) return;
					if(ex[1]){
						rules[ex[0]] = parseInt(ex[1]) ? parseInt(ex[1]) : ex[1]
					}else{
						rules[ex[0]] = true
					}
					t++
				})
				if(t) $(this).rules("add", rules)
			})

			e.preventDefault();
			if(!$(this.$el).valid()){
				if($(".error").length) $("html,body").animate({scrollTop:($(".error").offset().top-100)}, 300)
				return
			}
			this.query = $(this.$el).serialize();
			this.serialize = serialize($(this.$el));
			if (this._events.resp) return this.$emit('resp', this);
			if (typeof nds != "undefined") return false;
			// nds is no double submission, create nds variable after this function call
			nds = true;
			$form = $(this.$el);

			/*
				* Loading table
				*/
			if (this.type == "table") $(this.target).block({
				message: '<i class="icon-spinner4 spinner"></i>',
				timeout: 2000, //unblock after 2 seconds
				overlayCSS: {
					backgroundColor: '#fff',
					opacity: 0.8,
					cursor: 'wait'
				},
				css: {
					border: 0,
					padding: 0,
					backgroundColor: 'transparent'
				}
			});
			$button = $form.find(".btn-loading").html();
			$form.find(".btn-loading").html('<div class="loading-spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');

			/*
				* Parameter submission
				*/
			$data = serialize($form);
			if (this.method == 'post') $data['_token'] = _token;

			// Run ajax submission
			$.ajax({
				url: this.action,
				type: this.method,
				data: $data,
				beforeSubmit: () => {
					/* run loading button if button submit has 'btn-loading' class */
					$form.find("[type='submit'],button").attr('disabled', '');
				},
				error: () => {
					delete nds;
					$form.find("[type='submit'],button").removeAttr('disabled');
				},
				success: (resp) => {
					delete nds;
					if (this.type == "table") {
						$(this.target).unblock();
						app.query = Object.assign(app.query, $data);
						app.data = resp.data;
						app.paginate = resp.paginate;
						app.currentUrl = resp.url;
					}
					$form.find("[type='submit'],button").removeAttr('disabled');
					if (typeof btnloading == "undefined" && $form.find(".btn-loading").text() == "") {
						$form.find(".btn-loading").html($button);
					}
					if (this._events.success) return this.$emit('success', resp);
					if (typeof resp != "object") eval(resp);
				},
			});
		});
	},
	watch: {
		value: function (value) {
			// update value
			$(this.$el).val(value).select2();
		}
	}
});
Vue.component('uploader', {
	inject: ['$validator'],
	props: {
		name: String,
		type: String,
		value: {
			default: () => {
				return {}
			}
		},
		uploadType: {
			default: "upload"
		},
		param: {
			default: () => {
				return {}
			}
		},
		multiple: Boolean,
	},
	template: '<div class="upload-container">\
					<slot name="preview">\
						<span class="image-preview">\
							<span v-for="(v, k) in imageData">\
								<image-preview :src="assets(v)"></image-preview>\
								<input v-if="multiple" type="hidden" :name="name+\'[]\'" :value="v">\
							</span>\
							<input v-if="!multiple" type="hidden" :name="name" :value="imageData[0]">\
						</span>\
					</slot>\
					<a href="javascript:;" class="btn btn-info upload-btn">\
						<i class="icon-upload10"></i>\
						<span class="upload-label">\
							<slot v-if="!uploading" name="label" :uploadText="uploadText"><i class="fa fa-image"></i> {{uploadText}} Photo</slot>\
							<span v-if="uploading">Uploading...</span>\
						</span>\
						<input type="file" @change="onUpload" :id="name">\
					</a>\
					<span class="help-block">\
						<small>Accepted formats : {{conf.rule_type}}. Max file size {{uploader["max_image_size"].bytesToSize()}}</small>\
					</span>\
				</div>',
	data: function () {
		return {
			uploading: false,
			error: false,
			uploadText: "Upload",
			imageData: this.value,
			uploader: uploader,
			conf: uploader[this.type],
		}
	},
	mounted: function () {
		this.elFile = $(this.$el).find('[type="file"]');
		if (this.value.length) this.uploadText = "Update";
		if (typeof this.value != "object") this.imageData = [this.value];
	},
	methods: {
		assets: function (filename) {
			return base_url + "/" + this.conf.path + "/" + filename;
		},
		onUpload: function (e) {
			plugins(['imagefilter', 'vue-croppa']);
			if (typeof Croppa != "undefined") Vue.use(Croppa);
			this.fileData = this.elFile.prop('files')[0];
			this.conf.fileType = this.fileData.type;
			this.fileType = this.fileData.name.substr(this.fileData.name.lastIndexOf('.') + 1).toLowerCase();
			if (this.conf.rule_size){
				var reader = new FileReader();
				reader.onload = () => {
					var img = new Image;
					img.onload = () => {
						this.img = img
						this.uploadProcess(e)
					}
					img.src = reader.result
				};
				reader.readAsDataURL(this.fileData);
			}else{
				this.uploadProcess(e)
			}
		},
		uploadProcess: function(e){
			// Validation
			this.error = false;
			if (this.conf['rule_type'].indexOf(this.fileType) == -1) {
				this.error = 'File type must be ' + this.conf['rule_type'] + ' type.';
			}
			if (this.fileData.size > uploader['max_image_size']) {
				this.error = 'Max file size is 5MB';
			}
			if (this.conf.rule_size) if(this.img.naturalWidth<this.conf.rule_size[0]||this.img.naturalHeight<this.conf.rule_size[1]){
				this.error = 'Minimum image size is '+this.conf.rule_size[0]+"x"+this.conf.rule_size[1]
			}
			if (this.error) return alert(this.error);
			var formData = new FormData();
			formData.append('file', this.fileData);
			this.param._token = _token;
			this.param.pageType = this.type;
			this.param.uploadType = this.uploadType;
			if (this.multiple) this.param.multiple = true;
			$.each(this.param, (k, v) => {
				formData.append(k, v);
			});

			$.ajax({
				url: base_url + "/ajax/upload",
				type: "POST",
				data: formData,
				enctype: 'multipart/form-data',
				processData: false, // tell jQuery not to process the data
				contentType: false // tell jQuery not to set contentType
			}).done((resp) => {
				this.uploadText = "Update";
				if (this.uploadType == "upload") {
					if (this.multiple) {
						this.value.push(resp.filename);
						this.$emit('input', this.value);
					} else {
						this.value = [resp.filename];
						this.$emit('input', this.value[0]);
					}
					this.imageData = this.value
					this.$emit('response', this)
				}
				if (this.uploadType != "cropping") return 0;
				return imageFilter(resp.targetfile, (data) => {
					var form_data = new FormData();
					form_data.append("file", data);
					form_data.append("path", this.type);
					form_data.append("image_name", resp.filename);
					form_data.append("_token", _token);
					$.ajax({
						url: base_url + "/ajax/upload_filter",
						type: "POST",
						data: form_data,
						enctype: 'multipart/form-data',
						processData: false,  // tell jQuery not to process the data
						contentType: false,
						success: (a) => {
							if (this.multiple) {
								this.value.push(a.fileName);
								this.$emit('input', this.value);
							} else {
								this.value = [a.fileName];
								this.$emit('input', this.value[0]);
							}
							this.imageData = this.value;
							this.$emit('response', this);
						}
					});
				}, this.conf);
			});
		}
	},
	watch: {
		value: function (value) {
			this.imageData = value ? (this.multiple ? value : [value]) : "";
		}
	}
});
Vue.component('cropmodal', {
	template: '<div class="modal fade JCrop_preview" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
		<div class="modal-dialog">\
			<div class="modal-content">\
				<div class="modal-header">\
					<h4 class="modal-title" class="myModalLabel">Croping Image</h4>\
				</div>\
				<div class="modal-body"></div>\
				<div class="modal-footer">\
					<button type="button" class="btn btn-primary JC-upload">Submit</button>\
					<button type="button" class="btn btn-default JC-cancel">Cancel</button>\
				</div>\
			</div>\
		</div>\
	</div>'
});
Vue.component('rangeslider', {
	props:{
		min:{default:0},
		max:{default:10},
		value: Number,
	},
	template: '<input :min="min" :max="max" type="text">',
	mounted: function(){
		plugins('rangeslider');
		setTimeout(() => {
			$(this.$el).rangeslider({
				polyfill: false,
				// Callback function
				onInit: function () { },
				// Callback function
				onSlide: (position, value) => {
					this.$emit('input', value);
				},
				// Callback function
				onSlideEnd: function (position, value) { }
			});
		}, 200);
	},
	watch:{
		value:function (value) {
			$(this.$el).val(value).rangeslider('update', true);;
		}
	}
});
Vue.component('maskmoney', {
	props: {
		value: Number,
	},
	template: '<input type="text">',
	mounted: function () {
		plugins('maskmoney');
		$(this.$el).val(this.value).maskMoney({
			thousands: ".",
			decimal: ",",
			precision: 0,
		}).trigger('mask.maskMoney').keyup((e)=>{
			this.$emit('input', e.target.value)
		});
		maskmoney = this;
	},
	watch: {
		value: function (value) {
			$(this.$el).val(value).trigger('mask.maskMoney')
		}
	}
});
Vue.component('priceformat', {
	props: {
		value: Number,
	},
	template: '<input type="text">',
	mounted: function () {
		plugins('priceformat');
		$(this.$el).priceFormat({
			prefix:'',
			centsSeparator: ',',
			thousandsSeparator: '.',
			centsLimit: 0,
		}).val(Math.round(this.value)).trigger('keyup').keyup((e)=>{
			this.$emit('input', e.target.value)
		});
		maskmoney = this;
	},
	watch: {
		value: function (value) {
			$(this.$el).val(value).trigger('keyup')
		}
	}
});

/* ================================
= Vue App
==================================*/
var app = new Vue({
	el: '#app',
	data: (function () {
		var data = {};
		_vue.data.forEach((val) => {
			Object.assign(data, val);
		});
		return data;
	})(),
	methods: (function () {
		var methods = {};
		_vue.methods.forEach((val) => {
			Object.assign(methods, val);
		});
		return methods;
	})(),
	mounted: function () {
		_vue.mounted.forEach((foo) => {
			foo(this);
		});
		// default validation message
		$.extend($.validator.messages, {
			required: function(p,el){
				var element = $(el)
				var placement = $("[error='"+element.attr('name')+"']")
				var label = placement.attr('label') || fields[element.attr('name')]
				if(!label) return "Input wajib diisi"
				var msg = ['radio','checkbox'].indexOf(element.attr('type'))>-1?"Pilih":"Masukkan"
				return msg+" "+label+"."
			},
			email: "Masukkan format email yang benar.",
			number: "Masukkan format angka yang benar.",
			creditcard: "Please enter a valid credit card number.",
			equalTo: "Please enter the same value again.",
			maxlength: $.validator.format("Masukkan maksimal {0} karakter."),
			minlength: $.validator.format("Masukkan minimal {0} karakter."),
			rangelength: $.validator.format("Masukkan antara {0} sampai {1} karakter."),
			range: $.validator.format("Masukkan antara {0} sampai {1}."),
			max: $.validator.format("Masukkan maskimal {0}."),
			min: function(p,el){
				var element = $(el)
				var placement = $("[error='"+element.attr('name')+"']")
				var label = placement.attr('label') || element.attr('name')
				return placement.data('msg-min') || "Masukkan minimal "+p+"."
			}
		});
	},
	updated: function () {
		_vue.updated.forEach((foo) => {
			foo(this);
		});
	},
	watch: (function () {
		var watch = {};
		_vue.watch.forEach((val) => {
			Object.assign(watch, val);
		});
		return watch;
	})(),
});