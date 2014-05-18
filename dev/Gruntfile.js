module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.initConfig({

    jshint: {
      all: ['Gruntfile.js', 'index.js', 'src/**/*.js'],
    },

    
    watch: {
      scripts: {
        files: ['./src/*.js'],
        tasks: ['onsave'],
        options: {
          spawn: false,
        },
      }
    },

    nodemon: {
      run: {
        script: 'index.js'
      }
    } 

  });
  
  // Default task.
  grunt.registerTask('onsave', ['jshint:all']);
  grunt.registerTask('run', ['jshint:all', 'nodemon:run']);
  
};