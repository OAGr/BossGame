var Moving = {
	vertical_movement: 0,
	horizontal_movement: 6,
	angle: 0,
	angle_change: 150,
	movement_distance: 250,
	vertical_position: 0,
	horizontal_position: 0,
	horizontal_destination: 500,
	vertical_destination: 400,
	angle_destination: 0,
	close_length: 3000,
	start_time: 0,
	end_time: 0,
	travel_time: 3000,
	effective_angle_change: 0,

	intendedDirection: function() {
		var opposite = this.vertical_destination - this.vertical_position;
		var adjacent = this.horizontal_destination - this.horizontal_position;
		this.angle_destination = Math.floor(Math.atan2(opposite, adjacent) * 180 / Math.PI);

	},

	startTime: function(e) {
		Moving.start_time = e.timeStamp;
	},

	endTime: function(e) {
		Moving.end_time = e.timeStamp;
		var time_difference = Moving.end_time - Moving.start_time;
		var fraction = (Moving.close_length - time_difference) / Moving.close_length;
		Moving.effective_angle_change = Math.floor(Moving.angle_change * fraction);
	},

	choose: function() {
		var change = Math.floor(Math.random() * 2 * Moving.effective_angle_change) - Moving.effective_angle_change;
		this.angle = this.angle_destination + change;
	},

	moveDirections: function() {
		this.vertical_movement = Math.floor(this.movement_distance * Math.sin(this.angle * Math.PI / 180));
		this.horizontal_movement = Math.floor(this.movement_distance * Math.cos(this.angle * Math.PI / 180));
	},

	updatePosition: function() {

		this.vertical_position += this.vertical_movement;
		this.horizontal_position += this.horizontal_movement;
	},

}

var Guides = {
	line1Begin: Moving.angle_change,
	line2Begin: -1 * Moving.angle_change,
	line1Angle: 0,
	line2Angle: 0,
	close_length: Moving.close_length,

	position: function() {
		$('#lines').animate({
			rotate: Moving.angle_destination
		},
		1);
		//$('#lines').animate({top:Moving.vertical_position, left:Moving.horizontal_position}, 10);
		//$('#lines').css({'rotate': Moving.angle_destination}, 1);
		$('#lines').css('top', Moving.vertical_position);
		$('#lines').css('left', Moving.horizontal_position);
	},

	open: function() {
		line1Angle = Guides.line1Begin;
		line2Angle = Guides.line2Begin;
		$('#line1').animate({
			rotate: line1Angle
		},
		10);
		$('#line2').animate({
			rotate: line2Angle
		},
		10);
	},

	close: function() {
		$('#line1').animate({
			rotate: 0
		},
		Guides.close_length);
		$('#line2').animate({
			rotate: 0
		},
		Guides.close_length);
	}

};

jQuery.fn.extend({

});

jQuery(function() {

	$('#button-25').click(function(e) {
		e.preventDefault();
	});

	$('#button-25').mousedown(function(e) {
		$('#button-5-break').stop();
		Moving.startTime(e);
		Moving.updatePosition();
		
		Moving.intendedDirection();
		Guides.position();
		Guides.open();
		Guides.close();
		$('#lines').show();
		e.preventDefault();
	});

	$('#button-25').mouseup(function(e) {

		$('#lines').stop();
		$('#line1').stop();
		$('#line2').stop();

		Moving.endTime(e);
		Moving.choose();
		Moving.moveDirections();

		$('#button-5-break').animate({
			'top': Moving.vertical_position,
			'left': Moving.horizontal_position
		},
		Moving.travel_time);

		e.preventDefault();

	});

});
