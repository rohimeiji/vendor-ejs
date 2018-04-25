plugins(['rangeslider']);
IFApp = "";
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	var slice = byteCharacters.slice(offset, offset + sliceSize);

	var byteNumbers = new Array(slice.length);
	for (var i = 0; i < slice.length; i++) {
	  byteNumbers[i] = slice.charCodeAt(i);
	}

	var byteArray = new Uint8Array(byteNumbers);

	byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}
function imageFilter(url, callback, conf){
	$("body").append('<div id="ImageFilterApp"><div class="imagefilter">\
		<a href="javascript:;" class="btnClose" @click="onCancel">\
			<img src="'+base_url+'/assets/plugins/imagefilter/close.png" alt="close">\
		</a>\
		<div class="image-container">\
			<croppa v-show="!onFilter" v-model="croppa" :initial-image="imageUrl" :prevent-white-space="true" :show-remove-button="false" :quality="quality" @initial-image-loaded="onLoadImage(croppa.img)"></croppa>\
			<canvas v-show="onFilter" id="myCanvas"></canvas>\
		</div>\
		<div class="control-container">\
			<div class="text-center form-horizontal">\
				<div v-show="!onFilter">\
					<div>\
						<button class="btn btn-inverted btn-large" @click="onCancel"><span>Cancel</span></button>\
						<button class="btn btn-info btn-large" @click="startFilter()"><span>Filter</span></button>\
						<button class="btn btn-default btn-large" @click="onDone"><span>Done</span></button>\
					</div>\
				</div>\
				<div v-show="onFilter">\
					<div class="form-group">\
						<label class="col-sm-4"><i class="icon-brightness-contrast"></i> Brightness</label>\
						<div class="col-sm-6" style="padding-top:10px">\
							<rangeslider v-model="brightness" min="-50" max="50">\
						</div>\
					</div><br>\
					<div class="form-group">\
						<label class="col-sm-4"><i class="icon-contrast"></i> Contrast</label>\
						<div class="col-sm-6" style="padding-top:10px">\
							<rangeslider v-model="contrast" min="-50" max="50">\
						</div>\
					</div>\
					<div class="save-buttons">\
						<button class="btn btn-inverted btn-large" @click="onFilter=false"><span>Cancel</span></button>\
						<button class="btn btn-default btn-large" @click="okFilter"><span>OK</span></button>\
					</div>\
				</div>\
			</div>\
		</div>\
	</div>');
	// Vue
	IFApp = new Vue({
		el: "#ImageFilterApp",
		data: {
			imageUrl: url,
			croppa: {},
			image: new Image(),
			brightness: 0,
			contrast: 0,
			onFilter: false,
			quality: 1,
		},
		mounted: function(){
			this.imageCnt = $(this.$el).find('.image-container');
			$("html").css('overflow', 'hidden');
			$(window).resize(()=>{
				this.croppa.width = conf.img_ratio * this.imageCnt.height();
				this.croppa.height = this.imageCnt.height();
				if (this.croppa.width > this.imageCnt.width()){
					this.croppa.width =  this.imageCnt.width();
					this.croppa.height = this.imageCnt.width() / conf.img_ratio;
				}
			}).trigger('resize');

		},
		methods: {
			startFilter: function (a) {
				this.onFilter = true;
				return this.onLoadImage(this.croppa.img);
			},
			onLoadImage: function (image) {
				this.c = document.createElement("canvas");
				this.cN = document.getElementById("myCanvas");
				this.ctx = this.c.getContext("2d");
				this.ctxN = this.cN.getContext("2d");
				this.c.width = image.naturalWidth
				this.c.height = image.naturalHeight
				this.cN.width = image.naturalWidth
				this.cN.height = image.naturalHeight
				this.ctx.drawImage(image, 0, 0);
				this.ctxN.drawImage(image, 0, 0);
				this.quality = (this.c.width > 1200 ? 1200 : this.c.width) / this.croppa.width;
				if (conf.img_ratio == 0) {
					conf.img_ratio = this.c.width / this.c.height;
					$(window).trigger("resize");
				}
			},
			okFilter: function(){
				this.croppa.initialImage = this.cN.toDataURL(conf.fileType);
				this.croppa.img.src = this.croppa.initialImage;
				this.croppa.refresh();
				this.onFilter = false;
				this.brightness = 0;
				this.contrast = 0;
			},
			filterImage:function(){
				// filter brightness
				var imgData = this.ctx.getImageData(0, 0, this.c.width, this.c.height);
				var d = imgData.data;
				for (var i = 0; i < d.length; i += 4) {
					d[i] += this.brightness;
					d[i + 1] += this.brightness;
					d[i + 2] += this.brightness;
				}
				// filter contrast
				var factor = (259 * (this.contrast + 255)) / (255 * (259 - this.contrast));
				for (var i = 0; i < d.length; i += 4) {
					d[i] = factor * (d[i] - 128) + 128;
					d[i + 1] = factor * (d[i + 1] - 128) + 128;
					d[i + 2] = factor * (d[i + 2] - 128) + 128;
				}
				this.ctxN.putImageData(imgData, 0, 0);
			},
			onCancel: function(){
				$("html").css('overflow', 'auto');
				$("#ImageFilterApp").remove();
			},
			onDone: function(){
				this.croppa.generateBlob((blob) => {
					var url = URL.createObjectURL(blob)
					callback(blob, url);
					$("html").css('overflow', 'auto');
					$("#ImageFilterApp").remove();
				}, conf.fileType);
			}
		},
		watch: {
			brightness: function(value){
				this.filterImage();
			},
			contrast: function(value){
				this.filterImage();
			},
			onFilter: function(value){
				this.imageCnt.css('bottom', value ? 200 : 100);
				$(window).trigger("resize");
			}
		}
	});
}