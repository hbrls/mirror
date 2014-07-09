module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'app.js',
        'scripts/**/*.js',
        'tests/specs/**/*.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', [ ]);
  grunt.registerTask('test', [ 'jshint' ]);
};
