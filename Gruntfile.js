module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*!\n' +
                    ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
                    ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
                    ' */\n',
            },
            main: {
                src: 'js/<%= pkg.name %>.js',
                dest: 'js/<%= pkg.name %>.min.js'
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    src: 'css/<%= pkg.name %>.css',
                    dest: '',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['js/<%= pkg.name %>.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                },
            },
            cssmin: {
                files: ['css/<%= pkg.name %>.css'],
                tasks: ['cssmin'],
                options: {
                    spawn: false,
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['uglify', 'cssmin', 'watch']);
}