$(document).ready(function() {
	
	var parser = new less.Parser({});
	
	function constructPageWithCSS(css) {
		var html = '<!DOCTYPE html><html lang="en"><head><style type="text/css">';
		html += css;
		html += "</style></head><body>";
		html += $("#testSnippet").val();
		html += "</body></html>";
		return html;
	}
	
	$("#applyCSSbtn").click(function() {
		cssta.save();
		htmlta.save();
		var ifrm = document.getElementById("preview");
		var doc;
		if(ifrm.contentWindow)
			doc = ifrm.contentWindow.document;
		else if(ifrm.contentDocument)
			doc = ifrm.contentDocument;
		var format = $("input:radio[name=dsl]:checked").val();
		if (format == "SASS") {
			var css = Sass.compile($("#template_txt").val());
			if (typeof css === "string") {
				doc.open();
				doc.write(constructPageWithCSS(css));
				doc.close();
			}
			else {
				alert("Sass script is invalid");
			}
		}
		else { //less parser is used for parsing both less script and regular css 
			parser.parse($("#template_txt").val(), function (err, root) {
				if (err) {alert(err);}
				else {
					var css = root.toCSS();
					doc.open();
					doc.write(constructPageWithCSS(css));
					doc.close();
				}
				return false;
			});
		}
		return false;
	});
	
	function shareTemplate(css) {
		$("#template_txt").val(css);
		cssta.setValue($("#template_txt").val());
		cssta.save();
		htmlta.setValue($("#testSnippet").val());
		htmlta.save();
		if(localStorage){
			localStorage.setItem("metastyle", "set");
			var data = $("#template-generation").serializeArray();
			$.each(data, function(i, obj) {
				localStorage.setItem(obj.name, obj.value);
			});
		}
//		alert("submitting");
		document.forms["shareTempalte"].submit();
	}
	
	$("#shareTemplatebtn").click(function() {
		var format = $("input:radio[name=dsl]:checked").val();
		if (format == "SASS") {
			var css = Sass.compile($("#template_txt").val());
			shareTemplate(css);
		}
		else {
			parser.parse($("#template_txt").val(), function (err, root) {
				shareTemplate(root.toCSS());
				return false;
			});
		}
		return false;
	});
});