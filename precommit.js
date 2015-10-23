// precommit.js
 
var exec = require('child_process').exec;
// https://npmjs.org/package/execSync
// Executes shell commands synchronously
var sh = require('sync-exec').run;
 
exec('grunt', function (err, stdout, stderr) {
 
console.log(err);
console.log(stdout);


  // only run if there are staged changes
  // i.e. what you would be committing if you ran "git commit" without "-a" option.
  //if (err) {
	  
		exec('cd bower', function (err, stdout, stderr) { 
			exec('git add .', function (err, stdout, stderr) { 
				exec('git commit -m "bower"', function (err, stdout, stderr) { 
					exec('git push', function (err, stdout, stderr) { 
						exec('cd ..', function (err, stdout, stderr) { 
							exec('git add .', function (err, stdout, stderr) { 
								console.log(err);
								console.log(stdout);
						    });
						});
					});
				});
			});
		});
	  
	  /*exec('git add .', function (err, stdout, stderr) { 
		console.log(err);
		console.log(stdout);
	  });*/
  //}
	/*
    // stash unstaged changes - only test what's being committed
    sh('git stash --keep-index --quiet');
 
    exec('grunt {{task}}', function (err, stdout, stderr) {
 
      console.log(stdout);
 
      // restore stashed changes
      sh('git stash pop --quiet');
 
      var exitCode = 0;
      if (err) {
        console.log(stderr);
        exitCode = -1;
      }
      process.exit(exitCode);
    });*/
 
});