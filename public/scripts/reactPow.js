/* the container for the list of EVENTS and the form */
var EventBox = React.createClass({
	loadEventsFromDatabase: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this)
		});
	},
	submitNewEvent: function(event) {
		console.log("submitNewEvent!");
		var events = this.state.data;
		var newEvent = events.concat([event]);
		this.setState({date:newEvent});

		var formData = new FormData();
		formData.append("desc", event.desc);
		formData.append("title", event.title);
		formData.append("date", event.date);
		formData.append("image", $('input[type=file]')[0].files[0]);
		$.ajax({
			url: this.props.url,
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this)
		});
	},
	getInitialState: function() {
		return {data: []}
	},
	/* called when rendering finishes */
	componentDidMount: function() {
		this.loadEventsFromDatabase();
		/* can setInterval here to keep polling if wanted */
	},
	render: function() {
		return (
			<div className="eventBox">
				<h1>POW Events</h1>
				<EventList data={this.state.data} />
				<EventForm onEventSubmit={this.submitNewEvent} />
			</div>
		)
	}
});

/* contains an event for pow
 * an event contains:
 * - an IMAGE, a TITLE, a DATE, and a DESCRIPTION
 */
var Event = React.createClass({
	render: function() {
		return (
			<div className="event">
				<h2 className="title">
					{this.props.title}
				</h2>
				<br/>
				<h4> {this.props.data} </h4>
				<img src={this.props.image} width="200px" height="200px"/>
				<div className="description">
					{this.props.desc}
				</div>
			</div>
		)
	}
});

/* contains a list of EVENTs
 */
var EventList = React.createClass({
	render: function() {
		var eventNodes = this.props.data.map(function(event) {
			return (
			<Event desc={event.desc} date={event.date} title={event.title} image={event.image}>
				/* add text and image */
			</Event>
			);
		});
		return (
			<div className="eventList">
				{eventNodes}
			</div>
		)
	}
});

/* contains the form in order to add 
 * an event to the database
 */
var EventForm = React.createClass({
	getInitialState: function() {
		return {data:"", title:"", desc:""}
	},
	handleDateChange: function(e) {
		this.setState({date: e.target.value});
	},
	handleDescChange: function(e) {
		this.setState({desc: e.target.value});
	},
	handleTitleChange: function(e) {
		this.setState({title: e.target.value});
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var date = this.state.date.trim();
		var title = this.state.title.trim();
		var desc = this.state.desc.trim();
		if (!date || !title || !desc) {
			return;
		}
		this.props.onEventSubmit({date:date,title:title,desc:desc});
		this.setState({date:"", title:"", desc:""});
	},
	render: function() {
		return (
			<form 
				className="eventForm"
				onSubmit={this.handleSubmit}
				>
				<input
					type="text"
					name="title"
					placeholder="Event Title"
					value={this.state.title}
					onChange={this.handleTitleChange}
				/>
				<input
					type="text"
					name="date"
					placeholder="Event Date"
					value={this.state.date}
					onChange={this.handleDateChange}
				/>
				<input
					type="text"
					name="desc"
					placeholder="Event Description"
					value={this.state.desc}
					onChange={this.handleDescChange}
				/>
				<input
					type="file"
					name="image"
				/>
				<input
					type="submit"
					value="Post"
				/>
			</form>
		);
	}
});

ReactDOM.render(<EventBox url="/api/events" />, document.getElementById('content'));
