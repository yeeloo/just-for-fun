module.exports = function (grunt, options)
{
    return {
        options: {
            browsers: ['last 2 versions', 'ie >= 9']
        },
        single_file: {
            src: '<%= sourceDir %>inc/style/screen.css',
            dest: '<%= sourceDir %>inc/style/screen.css'
        }
    };
};