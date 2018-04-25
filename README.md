# Vendor EJS #

# PHP General Function Assets #
```
function vejs($fileloc=""){
	$url = env("APP_VEJS") ? "http://localhost/vendor-ejs" : "https://github.com/rohimeiji/vendor-ejs"; 
	return $url.($fileloc?"/".trim($fileloc, "/"):"");
}
```