var shell = require('shelljs');

shell.echo('echo')

// log(shell.cat('README.md').toString())

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
} else {
  shell.echo('Hello git');
}
shell.cd('node_modules');
// shell.exec('notepad', { async: true }) //非同期
// shell.exec('notepad') //同期
shell.exec('notepad', { async: true }, function(code) {
  console.log('notepadが終了しました')
  console.log(code)
})

shell.echo(shell.pwd())

function log(value) {
  console.log(value);
}