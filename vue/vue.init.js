moment.locale("id");
_vue = {
    form: [],
    data: [],
    methods: [],
    mounted: [],
    updated: [],
    watch: [],
};
// Init Variable
var W = window;
var isMobile = $(window).width() < 767;
var segment = location.href.replace(base_url, "").replace(location.search, "").split("/");
// Init Vue
function vue(param){
    if(param.data) _vue.data.push(param.data);
    if(param.methods) _vue.methods.push(param.methods);
    if(param.mounted) _vue.mounted.push(param.mounted);
    if(param.updated) _vue.updated.push(param.updated);
    if(param.watch) _vue.watch.push(param.watch);
}
vue({
    data:{
        query: location.search.queryToObject(),
        currentUrl: location.href,
    },
    mounted: function(app){
        $("html").css("opacity", 1);
    },
    methods:{
        submit: function (e) {
            $(e.target).parents('form').submit();
        },
        changeStatus: function (e, row) {
            e.preventDefault();
            var text = row.status ? "inactive" : "Active";
            swal({
                title: "Yakin ingin meng-" + text + "kan?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ya, " + text + "!",
                cancelButtonText: "Tidak, Cancel!",
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    $.post(location.href, { _token: _token, id: row.id, crud: 'status', status: text });
                    row.status = !row.status;
                }
            });
        },
        deleteData: function (e, data, key) {
            e.preventDefault();
            var row = data[key];
            var _this = e.target;
            swal({
                title: "Yakin ingin menghapus?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Ya, Hapus!",
                cancelButtonText: "Tidak, Cancel!",
                closeOnConfirm: false,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    $.post(location.href, { _token: _token, id: row.id, crud: 'delete' });
                    $(_this).parents('tr').addClass("animated bounceOutRight");
                    setTimeout(function () {
                        $(_this).parents('tr').removeClass("animated bounceOutRight");
                        data.splice(key, 1);
                    }, 1000);
                    swal("Terhapus!", "Informasi telah di hapus.", "success");
                }
            });
        }
    },
    watch:{
        currentUrl:function(value){
            history.pushState({}, '', value);
        }
    }
});

/* Vue Directive */
Vue.directive('lazy', {
    bind: function (el, bind) {
        var $el = $(el).width('100%');
        var p = bind.value;
        var imgurl = assets(p[0],p[1],p[2]);
        if (bind.modifiers.background) {
            $el.css('background-image', 'url(' + assets(p[0], p[1], p[3] ? p[3] : 5) + ')');
        } else {
            $el.attr('src', assets(p[0], p[1], p[3] ? p[3] : 5));
        }
        (function($el, imgurl, bind){
            var si = setInterval(() => {
                var winTop = $(window).scrollTop() - 200;
                var winBot = $(window).scrollTop() + $(window).height() + 50;
                var winWidth = $(window).width() + 50;
                var imgTop = $el.offset().top;
                var imgLeft = $el.offset().left;
                if (winBot >= imgTop && winTop <= imgTop && imgLeft >= -50 && imgLeft <= winWidth) {
                    var img = new Image();
                    img.onload = function () {
                        if (bind.modifiers.background) {
                            $el.css('background-image', 'url(' + imgurl + ')');
                        } else {
                            $el.attr('src', imgurl);
                        }
                    }
                    img.src = imgurl;
                    clearTimeout(si);
                }
            }, 200);
        })($el, imgurl, bind);
    }
})

/* Global Function */
function assets(type, filename, size) {
    sizePath = "";
    if(size) size = (imagesize[size] ? imagesize[size][isMobile?0:1] :size);
    if(size) sizePath = "/img/"+size;
    return base_url + sizePath + "/" + path[type] + (filename ? "/" + filename : "" );
}
function openModal(name){
    $('#modal'+name).modal();
}
function closeModal(){
    $(".modal").modal('hide');
}
/* Directive */
Vue.directive('tooltip', {
    bind: function (el, binding, vnode) {
        var text = typeof binding.value == "string" ? binding.value : binding.value.text;
        var options = {
            html: true,
            placement: 'auto',
            title: text
        }
        if(typeof binding.value == "object") options = Object.assign(options, binding.value)
        $(el).tooltip(options);
    }
})
var lazyFunc = function(el, bind){
    var $el = $(el).width('100%');
    var p = bind.value;
    var imgurl = assets(p[0], p[1], p[2]);
    if (bind.modifiers.background) {
        $el.css('background-image', 'url(' + assets(p[0], p[1], p[3] ? p[3] : 5) + ')');
    } else {
        $el.attr('src', assets(p[0], p[1], p[3] ? p[3] : 5));
    }
    (function ($el, imgurl, bind) {
        var si = setInterval(() => {
            var winTop = $(window).scrollTop() - 200;
            var winBot = $(window).scrollTop() + $(window).height() + 50;
            var winWidth = $(window).width() + 50;
            var imgTop = $el.offset().top;
            var imgLeft = $el.offset().left;
            if (winBot >= imgTop && winTop <= imgTop && imgLeft >= -50 && imgLeft <= winWidth) {
                var img = new Image();
                img.onload = function () {
                    if (bind.modifiers.background) {
                        $el.css('background-image', 'url(' + imgurl + ')');
                    } else {
                        $el.attr('src', imgurl);
                    }
                }
                img.src = imgurl;
                clearTimeout(si);
            }
        }, 200);
    })($el, imgurl, bind);
}
Vue.directive('lazy', {
    bind: lazyFunc,
    update: lazyFunc
})