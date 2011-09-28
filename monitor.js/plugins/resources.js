var os = require('os');

/**
 * Get resource usage for the server<br />
 * (uptime, load averages, memory and CPU usage)
 * @param request
 * @param response
 */
exports.get = function(request, response) {

    // Get load averages and uptime
    var information = {
        uptime: monitor.utils.split_time(os.uptime()),
        load_averages: os.loadavg(),
        cpu_usage: []
    };
    
    // Get CPU usage for each CPU
    var raw_cpu_data = os.cpus();
    if (raw_cpu_data !== undefined) {
        for (var cpu_iterator = 0; cpu_iterator < raw_cpu_data.length; cpu_iterator++) {
            var cpu = raw_cpu_data[cpu_iterator];
            information.cpu_usage[cpu_iterator] = (cpu.times.user + cpu.times.sys) / (cpu.times.user + cpu.times.sys + cpu.times.idle) * 100;
        }
    }
    
    // Get memory usage (try /proc/meminfo first, but then fall back to native Node.js methods)
    try {
        var exec = require('child_process').exec;
        exec("cat /proc/meminfo | grep Active: | awk '{print $2}'", function(error, stdout, stderr) {
            var active_memory = stdout;
            exec("cat /proc/meminfo | grep MemTotal: | awk '{print $2}'", function(error, stdout, stderr) {
                information.memory_usage = active_memory / stdout * 100;
                response.send(information, { 'Content-Type': 'application/json' });
            });
        });
    } catch (e) {
    	// A really dirty and inaccurate way to judge memory usage
        information.memory_usage = os.freemem() / os.totalmem() * 100;
        response.send(information, { 'Content-Type': 'application/json' });
    }

};