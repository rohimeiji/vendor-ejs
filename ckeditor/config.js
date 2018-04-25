/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// config.toolbar_Full = [
	//     { name: 'document', items : [ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ] },
	//     { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
	//     { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
	//     { name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',

	//          'HiddenField' ] },
	//     '/',
	//     { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
	//     { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
	//     { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
	//     { name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe' ] },
	//     '/',
	//     { name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
	//     { name: 'colors', items : [ 'TextColor','BGColor' ] },
	//     { name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About' ] }
	// ];

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbar = [
		{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
		// { name: 'editing', items: [ 'Scayt' ] },
		{ name: 'basicstyles', items: [ 'Bold', 'Italic','Strike', '-', 'RemoveFormat' ] },
		{ name: 'paragraph', items: [ 'NumbererList', 'BulletedList','-', 'Outdent', 'Indent','-','Blockquote','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock' ] },
		{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
		{ name: 'tools', items: [ 'Maximize' ] },
		{ name: 'document', items: [ 'Source'/*, '-', 'NewPage', 'Preview', '-', 'Templates'*/ ] },
		'/',
		{ name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar', 'Smiley', 'PageBreak', 'Iframe'] },
		{ name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
		{ name: 'colors', items : [ 'TextColor','BGColor' ] },
	];


	// CKEDITOR PLUGINS LOADING
	config.extraPlugins = 'pbckcode'; // add other plugins here (comma separated)

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	//config.removeButtons = 'Underline,Subscript,Superscript';

	// ADVANCED CONTENT FILTER (ACF)
	// ACF protects your CKEditor instance of adding unofficial tags
	// however it strips out the pre tag of pbckcode plugin
	// add this rule to enable it, useful when you want to re edit a post
	// Only needed on v1.1.x and v1.2.0
	//config.allowedContent= 'pre[*]{*}(*)'; // add other rules here
	config.allowedContent = true;
	// config.enterMode = CKEDITOR.ENTER_BR;
	//config.autoParagraph = true;
	//config.removeButtons = 'Underline,Subscript,Superscript';
	config.protectedSource.push(/<i[^>]*><\/i>/g);
	config.protectedSource.push(/<span[^>]*><\/span>/g);
	config.protectedSource.push(/<label[^>]*><\/label>/g);
	config.protectedSource.push(/<br><\/br>/g);
	config.protectedSource.push(/<br>/);
	config.extraAllowedContent = 'i(*)';

	// Set the most common block elements.
	//config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	//config.removeDialogTabs = 'image:advanced;link:advanced';


	// PBCKCODE CUSTOMIZATION
	config.pbckcode = {
		// An optional class to your pre tag.
		cls : '',

		// The syntax highlighter you will use in the output view
		highlighter : 'PRETTIFY',

		// An array of the available modes for you plugin.
		// The key corresponds to the string shown in the select tag.
		// The value correspond to the loaded file for ACE Editor.
		modes : [ ['HTML', 'html'], ['CSS', 'css'], ['PHP', 'php'], ['JS', 'javascript'] ],

		// The theme of the ACE Editor of the plugin.
		theme : 'textmate',

		// Tab indentation (in spaces)
		tab_size : '4',

		// the root path of ACE Editor. Useful if you want to use the plugin
		// without any Internet connection
		js : "http://cdn.jsdelivr.net//ace/1.1.4/noconflict/"
	};
};

CKEDITOR.dtd.$removeEmpty['i'] = false;