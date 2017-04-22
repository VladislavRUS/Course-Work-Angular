function slideAnimation() {
	return {
		enter: function(element, doneFn) {
			var display = $(element).css('display');

			$(element).velocity('slideDown', {
				duration: 300,
				easing: [0.4, 0.0, 0.2, 1],
				complete: function() {
					$(element).css('display', display);
					doneFn();
				}
			})
		},

		leave: function(element, doneFn) {
			$(element).velocity('slideUp', {
				duration: 300,
				easing: [0.4, 0.0, 0.2, 1],
				complete: function() {
					doneFn();
				}
			})
		}
	}
}