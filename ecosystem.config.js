module.exports = {
  apps : [{
    name   : "lab.cs",
    port : '3000',
    exec_mode : "cluster",
    instances : 1,
    script : "./standalone/server.js",
  }]
}
