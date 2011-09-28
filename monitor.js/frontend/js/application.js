var monitor = {
	resources: function() {
		$.ajax({
			url: '/resources',
			success: function(data) {
				$('#cpu').html('');
				for (var cpu = 0; cpu < data.cpu_usage.length; cpu++) {
					$('<div />').text(data.cpu_usage[cpu].toFixed(2) + "%")
						.css('width', data.cpu_usage[cpu].toFixed(0) + "%")
						.addClass('bar')
						.appendTo($('#cpu'));
				}
				
				// Memory usage
				$('#memory').text(data.memory_usage.toFixed(2) + "%")
					.css('width', data.memory_usage.toFixed(0) + "%");
				
				// Uptime
				$('#uptime').text(data.uptime);
				
				// Load averages
				$.each(data.load_averages, function(average_iterator, average) {
					data.load_averages[average_iterator] = average.toFixed(2);
				});
				$('#load_averages').text(data.load_averages.join(', '));
			}
		});
	},
	
	load_meta: function() {
		$.ajax({
			url: '/meta',
			success: function(data) {
				$('.information').text(data.host);
				
				$('.plugins').html('');
				$.each(data.plugins, function(plugin_iterator, plugin) {
					$('<div />').append($('<a />')
						.text(plugin)
						.attr('href', '#'))
						.click(function() {
							$.ajax({
								url: "/" + plugin,
								success: function(data, textStatus, jqXHR) {
									$('.result').text(jqXHR.responseText);
								},
								error: function(jqXHR, textStatus, errorThrown) {
									$('.result').text(errorThrown);
								}
							});
							
							return false;
						})
						.appendTo($('.plugins'));
				});
			}
		});
	}
};

$(document).ready(function() {
	monitor.resources();
	setInterval(monitor.resources, 1000);
	monitor.load_meta();
});