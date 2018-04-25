const basePath = base_url + "/assets/plugins/"
const pluginList = {
    'jquery': { check: "jQuery", path: 'jquery', js: 'jquery.js', },
    'angular': { check: "angular", path: 'angularjs', js: 'angular.min.js', },
    'vue': { check: "Vue", path: 'vue', js: 'vue.min.js', },
    'vee-validate': { check: "VeeValidate", path: 'vue', js: 'vee-validate.js', },
    'jquery-validation': { check: "$.validator", path: 'jquery-validation', js: 'jquery-validation.js', },
    'moment': { check: "moment", path: 'moment', js: 'moment-locales.min.js', },
    'colorbox': { check: "$.fn.colorbox", path: 'colorbox', css: 'colorbox.css', js: 'colorbox.js', },
    'fancybox': { check: "$.fn.fancybox", path: 'fancybox', css: 'fancybox.css', js: 'fancybox.min.js', },
    'Jcrop': { check: "$.fn.Jcrop", path: 'Jcrop', css: 'jquery.Jcrop.min.css', js: 'jquery.Jcrop.min.js', },
    'select2': { check: "$.fn.select2", path: 'select2', css: 'select2.css', js: 'select2.js', },
    'blockUI': { check: "$.fn.blockUI", path: 'blockUI', js: 'jquery.blockUI.js', },
    'ckeditor': { check: "CKEDITOR", path: 'ckeditor', js: 'ckeditor.js', },
    'bs-datepicker': { check: "$.fn.datepicker", path: 'bootstrap-datepicker', css: 'bootstrap-datepicker.min.css', js: 'bootstrap-datepicker.min.js', },
    'bs-daterangepicker': { check: "$.fn.daterangepicker", path: 'bootstrap-daterangepicker', css: 'daterangepicker.css', js: 'daterangepicker.js', },
    'sweetalert': { check: "swal", path: 'sweetalert', css: 'sweetalert.css', js: 'sweetalert.js', },
    'socket': { check: "io", path: 'socket', js: 'socket.io.js', },
    'maskmoney': { check: "$.fn.maskMoney", path: 'maskmoney', js: 'jquery.maskMoney.min.js', },
    'priceformat': { check: "$.fn.priceFormat", path: 'maskmoney', js: 'jquery.priceformat.min.js', },
    'timeago': { check: "$.fn.timeago", path: 'timeago', js: 'jquery-timeago.js', },
    'highlight': { check: "$.fn.highlight", path: 'highlight', js: 'highlight.js', },
    'rangeslider': { check: "$.fn.rangeslider", path: 'rangeslider', css: 'rangeslider.css', js: 'rangeslider.min.js', },
    'imagefilter': { check: "imageFilter", path: 'imagefilter', css: 'imagefilter.css', js: 'imagefilter.js', },
    'blueimp-gallery': { check: "blueimp", path: 'blueimp-gallery', css: 'blueimp-gallery.css', js: 'jquery.blueimp-gallery.js', },
    'vue-croppa': { check: "Croppa", path: 'vue/vue-croppa', css: 'vue-croppa.min.css', js: 'vue-croppa.min.js', },
    'masonry': { check: "$.fn.masonry", path: 'masonry', js: 'masonry.min.js', },
    'vue-masonry': { check: "VueMasonry", path: 'vue/masonry', js: 'masonry.min.js', },
    'swal': { check: "swal", path: 'sweetalert', css:'sweetalert.css', js: 'sweetalert.js', },
    'bs-select': { check: "selectpicker", path: 'bs-select', css:'bs-select.css', js: 'bs-select.js', },
    'sortable': { check: "Sortable", path: 'Sortable', js: 'Sortable.min.js', },
}

var plugins = function($param) {
    if (typeof $param == "string") $param = [$param];
    $param.forEach((pluginName, i) => {
        const plugin = pluginList[pluginName];
        var href = 'href="' + basePath + plugin.path + "/" + plugin.css + '"';
        if (plugin.css && !$('link[' + href + ']').length) $("head").append('<link ' + href + ' rel="stylesheet">');
        var jsList = plugin.js;
        if(typeof jsList != "object") jsList = [jsList];
        if (eval("typeof " + plugin.check) == "undefined") $.each(jsList, (k, js)=>{
            var src = basePath + plugin.path + "/" + js;
            $.ajax({
                url:src,
                async: false,
                success:r=>eval(r)
            });
        });
    });
}