module.exports = function (grunt)
{
    grunt.registerTask('create-component', 'Create a component (template, viewmodel and controller).', function (n)
    {
        var name = grunt.option('name');
        var events = grunt.option('events');

        if (typeof name == 'undefined' || name == '' || typeof name == 'boolean')
        {
            grunt.log.warn('Error: No component name given!');
            showHelp();

            return;
        }

        var camelCaseName;
        var basename;
        var path = name + '/';
        var underscorePath = underscore(name);

        if (name.split('/').length > 1)
        {
            var parts = name.split('/');
            basename = parts.pop();
            camelCaseName = camelCase(basename);
        }
        else
        {
            camelCaseName = camelCase(name);
            basename = name;
        }

        var componentDir = grunt.config('create-component.options.componentDir');
        var templateDir = grunt.config('create-component.options.templateDir');
        var scssDir = grunt.config('create-component.options.scssDir');
        var componentScssPath = grunt.config('create-component.options.componentScssPath');
        var scssComponentDir = grunt.config('create-component.options.scssComponentDir');

        if (grunt.file.exists(componentDir + path) && grunt.option('force') != true)
        {
            grunt.log.error('Component exists! Choose a different name or use --force to overwrite');

            return;
        }

        var templateVars = {
            name: name,
            camelCaseName: camelCaseName,
            viewModelName: camelCaseName + 'ViewModel',
            controllerName: camelCaseName + 'Controller',
            optionsName: camelCaseName + 'Options',
            eventName: camelCaseName + 'Event',
            bundleName: camelCaseName + 'Bundle',
            underscorePath: underscorePath,
            scssName: name,
            basename: basename,
            path: path,
            template: basename + '.html'
        };


        if (events == true)
        {
            writeTemplate(templateDir + 'event/controller.txt', componentDir + path + templateVars.controllerName + '.ts', templateVars);
            writeTemplate(templateDir + 'event/event.txt', componentDir + path + templateVars.eventName + '.ts', templateVars);
        }
        else
        {
            writeTemplate(templateDir + 'controller.txt', componentDir + path + templateVars.controllerName + '.ts', templateVars);
        }
        
        writeTemplate(templateDir + 'viewmodel.txt', componentDir + path + templateVars.viewModelName + '.ts', templateVars);
        writeTemplate(templateDir + 'options.txt', componentDir + path + templateVars.optionsName + '.ts', templateVars);
        writeTemplate(templateDir + 'bundle.txt', componentDir + path + templateVars.bundleName + '.js', templateVars);
        writeTemplate(templateDir + 'template.txt', componentDir + path + templateVars.template, templateVars);
        writeTemplate(templateDir + 'scss.txt', scssDir + scssComponentDir + templateVars.scssName + '.scss', templateVars);
 
        updateScreenSCSS(scssDir + componentScssPath, templateVars.scssName);

        grunt.log.subhead('Component creation succesful!');
        grunt.log.writeln('To use your component, open a view template and type the following:');
        grunt.log.writeln('<!--ko component: \'' + templateVars.name + '\'--><!--/ko-->');
    });

    function showHelp()
    {
        grunt.log.subhead('Usage: grunt create-component --name [COMPONENT-NAME]');
        grunt.log.writeln('This will create the component with the given name. Dashed names are transformed to camelCase ' +
        'filenames (e.g. uber-component will be UberComponentController, etc).');
        grunt.log.writeln('');
        grunt.log.writeln("  --name\t\t\tName of the component, dashed (e.g. my-uber-component)");
        grunt.log.writeln("  --force\t\t\tForce creation of a component. Will overwrite if component with same name already exists");
        grunt.log.writeln("  --events\t\t\tCreate an Event class which extends BaseEvent");
    }

    function updateScreenSCSS(componentScssPath, newFilePath)
    {
        var screen = grunt.file.read(componentScssPath).split("\n");
        var newLine = '@import "' + newFilePath + '";';

        for (var i = 0; i < screen.length; i++)
        {
            if (screen[i] == newLine)
            {
                // nothing to do, line already exists
                return;
            }
        }

        screen.push(newLine);

        grunt.file.write(componentScssPath, screen.join("\n"));
    }

    function writeTemplate(inFile, outFile, vars)
    {
        var file = grunt.file.read(inFile);

        file = file.replace(/\{([a-zA-Z]+)\}/ig, function (matched, key)
        {
            if (typeof vars[key] != 'undefined')
            {
                return vars[key];
            }
            else
            {
                grunt.log.warn('writeTemplate error: cannot replace ' + matched);
            }
        });

        grunt.file.write(outFile, file);
    }

    function camelCase(string)
    {
        return string.replace(/(^[a-z]|\-[a-z])/g, function (x)
        {
            return x.replace(/-/, '').toUpperCase()
        });
    }

    function underscore(string)
    {
        return string.replace(/\//g, '_');
    }
};