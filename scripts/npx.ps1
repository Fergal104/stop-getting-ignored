$nodeExe = 'C:\Program Files\nodejs\node.exe'
$npxCli = 'C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js'
& $nodeExe $npxCli @Args
exit $LASTEXITCODE

