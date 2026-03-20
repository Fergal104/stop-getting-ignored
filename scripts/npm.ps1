$nodeExe = 'C:\Program Files\nodejs\node.exe'
$npmCli = 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js'
& $nodeExe $npmCli @Args
exit $LASTEXITCODE

