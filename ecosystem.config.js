module.exports = {
  apps : [{
    name   : "lab.cs",
    port : '3000',
    exec_mode : "cluster",
    instances : 4,
    interpreter: '/bin/bash',
    script    : 'node_modules/next/dist/bin/next',
    args      : 'start',
  }]
}