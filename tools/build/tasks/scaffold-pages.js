module.exports = function(grunt)
{
	var path = require('path');

	// todo: copy from template files
	grunt.registerMultiTask('scaffold-pages', 'Scaffold pages from the Gaia Sitemap', function()
	{
		var templateContent = grunt.file.read(path.join(grunt.config.data.gruntDir, 'tasks/scaffold-pages/template.txt'));
		var controllerContent = grunt.file.read(path.join(grunt.config.data.gruntDir, 'tasks/scaffold-pages/controller.txt'));
		var viewmodelContent = grunt.file.read(path.join(grunt.config.data.gruntDir, 'tasks/scaffold-pages/viewmodel.txt'));
		var pageScssContent = grunt.file.read(path.join(grunt.config.data.gruntDir, 'tasks/scaffold-pages/pageScss.txt'));
		var pagesContent = grunt.file.read(path.join(grunt.config.data.gruntDir, 'tasks/scaffold-pages/page.txt'));

		var pagesPath = grunt.config('scaffold-pages.options.pagesPath');

		var constList = {
			pages: [],
			popups: []
		}

		var scaffoldPage = function (page, type, path)
		{
			path += (path == '' ? '' : '/') + page.id;
			console.log(path);

			constList[type].push({
				id: page.id,
				path: path
			});

			var defaultFileName = page.id + '/' + page.id.charAt(0).toUpperCase() + page.id.replace(/\-[a-z\d]/g,function(x)
			{				return x[1].toUpperCase();
			}).substr(1);

			// naming conventions
			var defaultTemplate = page.id + '.html';
			var defaultStyle = page.id + '.scss';
			var defaultController = defaultFileName + 'Controller';
			var defaultViewModel = defaultFileName + 'ViewModel';

			var folder = page.folder || '';

			var templateDir = grunt.config('scaffold-pages.options.templateDir') + folder;
			var templateDirMobile = grunt.config('scaffold-pages.options.templateDirMobile') + folder;

			var scriptDir = grunt.config('scaffold-pages.options.scriptDir');

			var styleDir = grunt.config('scaffold-pages.options.styleDir') + folder;
			var styleDirMobile = grunt.config('scaffold-pages.options.styleDirMobile') + folder;

			var outputDir = scriptDir + grunt.config('scaffold-pages.options.outputDir') + folder;
			var outputDirMobile = scriptDir + grunt.config('scaffold-pages.options.outputDirMobile') + folder;

			// create all stuff
			check(createTemplate, page, page.template, templateContent, defaultTemplate, templateDir, templateDirMobile);
			check(createStyle, page, page.template, pageScssContent, defaultStyle, styleDir, styleDirMobile);

			check(createController, page, page.controller, controllerContent, defaultController, outputDir, outputDirMobile);
			check(createViewModel, page, page.viewModel, viewmodelContent, defaultViewModel, outputDir, outputDirMobile);

			// subpages
			if(typeof page.pages !== 'undefined')
			{
				for(var i = 0; i < page.pages.length; ++i)
				{
					scaffoldPage(page.pages[i], type, path);
				}
			}
			if(typeof page.popups !== 'undefined')
			{
				for(var i = 0; i < page.popups.length; ++i)
				{
					scaffoldPage(page.popups[i], 'popups', path);
				}
			}
		};


		// created because in the sitemap the function define is called
		var define = function()
		{
			var sitemap;

			// for when site map is define({});
			if( arguments.length == 1 ){
				sitemap = arguments[0];

				// for when site map is define([],function(){});
			} else if( arguments.length == 2 ) {
				sitemap = arguments[1].call(null);
			}

			if(typeof sitemap.pages !== 'undefined')
			{
				for(var i = 0; i < sitemap.pages.length; ++i)
				{
					var page = sitemap.pages[i];
					scaffoldPage(page, 'pages', '');
				}
			}

			if(typeof sitemap.popups !== 'undefined')
			{
				for(i = 0; i < sitemap.popups.length; ++i)
				{
					page = sitemap.popups[i];
					scaffoldPage(page, 'popups', '');
				}
			}

			createStyleCollectionFile();
			createPagesFile(pagesContent, pagesPath, constList);
		};

		var sitemap = grunt.file.read(grunt.config('scaffold-pages.options.sitemap'));
		eval(sitemap);
	});

	function check(createFunc, page, value, content, defaultName, dir, dirMobile, isMobile)
	{
		if(typeof isMobile === 'undefined')
		{
			isMobile = false;
		}

		// if object, app and mobile are both custom
		if(typeof value === 'object')
		{
			check(createFunc, page, value.app, content, defaultName, dir, dirMobile);
			check(createFunc, page, value.mobile, content, defaultName, dir, dirMobile, true);
		}
		// mobile, create both using convention
		else if(value == 'mobile')
		{
			createFunc(content, dir + defaultName, page);
			createFunc(content, dirMobile + defaultName, page);
		}
		// missing, create using convention
		else if(typeof value === 'undefined')
		{
			createFunc(content, (isMobile ? dirMobile : dir) + defaultName, page);
		}
		// if not default, create the path specified
		else if(value != 'default')
		{
			createFunc(content, (isMobile ? dirMobile : dir) + value, page);
		}
	}

	function createStyleCollectionFile()
	{
		var styleDir = grunt.config('scaffold-pages.options.styleDir');
		var styleDirMobile = grunt.config('scaffold-pages.options.styleDirMobile');
		var content = '', settings;
		var path = styleDir + 'page.scss';

		if(grunt.file.exists(path))
		{
			content += grunt.file.read(path);
		}

		for(var i = 0; i < createStyleCollectionFile._files.length; i++)
		{
			settings = createStyleCollectionFile._files[i];
			content += '@import "' + settings.path.replace(styleDir, '') + '";' + "\n";
		}

		grunt.file.write(path, content);
	}

	createStyleCollectionFile._files = [];
	createStyleCollectionFile.add = function(path, content)
	{
		createStyleCollectionFile._files.push({path: path, content: content});
	}


	function createStyle(content, path, page)
	{
		if(!grunt.file.exists(path))
		{
			console.log('creating ', path, '...');

			var filename = path.split('/').pop().replace('.ts', '');

			content = content
				.replace(/\{filename\}/gim, filename)
				.replace(/\{id\}/gim, page.id)
				.replace(/\{title\}/gim, page.title);


			
			
			createStyleCollectionFile.add(path, content);
			grunt.file.write(path, content );

		}
	}

	function createTemplate(content, path, page)
	{
		if(!grunt.file.exists(path))
		{
			console.log('creating ', path, '...');

			grunt.file.write(path, content
				.replace(/\{page\.id\}/gim, page.id)
				.replace(/\{page\.title\}/gim, page.title)
			);
		}
	}

	function createController(content, path, page, isMobile)
	{
		if(!grunt.file.exists(path + '.ts'))
		{
			console.log('creating ', path, '...');

			var filename = path.split('/').pop().replace('.ts', '');

			content = content
				.replace(/\{filename\}/gim, filename);

			if(page.viewModel != 'default')
			{
				var vmpath = getViewModelPath(page, isMobile);
				var vmfilename = vmpath.split('/').pop().replace('.ts', '');

				content = content
					.replace(/\{viewmodel\.path\}/gim, vmpath)
					.replace(/\{viewmodel\.filename\}/gim, vmfilename)
					.replace(/\/\/\{viewmodel\.remove\}/gim, '');
			}
			else
			{
				content = content.replace(/^.*\/\/\{viewmodel\.remove\}$/gim, '');
			}

			grunt.file.write(path + '.ts', content);
		}
	}

	function createViewModel(content, path, page)
	{
		if(!grunt.file.exists(path + '.ts'))
		{
			console.log('creating ', path, '...');

			var filename = path.split('/').pop().replace('.ts', '');

			grunt.file.write(path + '.ts', content
				.replace(/\{filename\}/gim, filename)
			);
		}
	}

	function getViewModelPath(page, isMobile)
	{
		var folder = page.folder || '';
		var path = grunt.config('scaffold-pages.options.outputDir') + folder;
		var pathMobile = grunt.config('scaffold-pages.options.outputDirMobile') + folder;

		var defaultFileName = page.id + '/' + page.id.charAt(0).toUpperCase() + page.id.replace(/\-[a-z\d]/g,function (x)
		{
			return x[1].toUpperCase();
		}).substr(1);

		// naming conventions
		var defaultViewModel = defaultFileName + 'ViewModel';

		// default
		if(typeof page.viewModel === 'undefined')
		{
			return path + defaultViewModel;
		}
		else if(page.viewModel == 'mobile')
		{
			if(isMobile)
			{
				return pathMobile + defaultViewModel;
			}
			else
			{
				return path + defaultViewModel;
			}
		}
		else if(typeof page.viewModel === 'object')
		{
			if(isMobile)
			{
				return pathMobile + page.viewModel.mobile;
			}
			else
			{
				return path + page.viewModel.app;
			}
		}
		else
		{
			return path + page.viewModel;
		}
	}

	function createPagesFile(content, path, constList)
	{
		var lines = [];

		var clone = /^(.*) \/\/clone$/gim.exec(content)[1];

		for (var i = 0; i < constList.pages.length; i++)
		{
			var page = constList.pages[i];
			lines.push(clone
				.replace('{id}', page.id.toUpperCase().replace(/(-)/gi, '_'))
				.replace('{path}', page.path)
			);
		}
		lines.push('\t');
		for (i = 0; i < constList.popups.length; i++)
		{
			page = constList.popups[i];
			lines.push(clone
				.replace('{id}', 'POPUP_' + page.id.toUpperCase().replace(/(-)/gi, '_'))
				.replace('{path}', page.path)
			);
		}

		content = content.replace(/^(.* \/\/clone)$/gim, lines.join('\n'));

		grunt.file.write(path, content);
	}
};