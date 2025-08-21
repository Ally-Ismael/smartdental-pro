(function initGlobal() {
	var yearEl = document.getElementById('year');
	if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();

(function initChatbot() {
	var toggle = document.getElementById('chatToggle');
	var win = document.querySelector('#chatbot .chat-window');
	var form = document.getElementById('chatForm');
	var input = document.getElementById('chatMsg');
	var body = document.getElementById('chatBody');
	if (!toggle || !win || !form || !input || !body) return;

	toggle.addEventListener('click', function () {
		var hidden = win.hasAttribute('hidden');
		if (hidden) { win.removeAttribute('hidden'); input.focus(); }
		else { win.setAttribute('hidden', ''); }
	});

	function appendMsg(text, who) {
		var div = document.createElement('div');
		div.className = 'msg ' + who;
		div.innerHTML = text;
		body.appendChild(div);
		body.scrollTop = body.scrollHeight;
	}

	function classify(text) {
		var t = text.toLowerCase();
		var emergencyKeywords = ['bleeding', 'heavy bleed', 'knocked', 'trauma', 'swelling', 'fever', 'fracture'];
		var soonKeywords = ['pain', 'toothache', 'broken', 'lost filling', 'sensitivity', 'swollen', 'chip'];
		for (var i = 0; i < emergencyKeywords.length; i++) {
			if (t.indexOf(emergencyKeywords[i]) !== -1) return 'emergency';
		}
		for (var j = 0; j < soonKeywords.length; j++) {
			if (t.indexOf(soonKeywords[j]) !== -1) return 'soon';
		}
		return 'routine';
	}

	function guidance(level) {
		if (level === 'emergency') return '<span class="badge emergency">Emergency</span> Significant symptoms detected. Please seek urgent care. We will prioritize the earliest slot available.';
		if (level === 'soon') return '<span class="badge soon">Soon</span> We recommend a prompt appointment in the next 24–48 hours.';
		return '<span class="badge routine">Routine</span> Suitable for a routine check-up or cleaning.';
	}

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		var msg = input.value.trim();
		if (!msg) return;
		appendMsg(msg, 'user');
		input.value = '';
		var level = classify(msg);
		setTimeout(function () {
			appendMsg(guidance(level) + '<br/><a class="btn primary" href="bookings.html">Book now</a>', 'bot');
		}, 350);
	});

	setTimeout(function () { appendMsg('Hi! Describe your symptoms and I\'ll guide you.', 'bot'); }, 500);
})();

(function initBookings() {
	var page = document.body;
	if (!page || !document.getElementById('bookingForm')) return;

	var form = document.getElementById('bookingForm');
	var dateEl = document.getElementById('date');
	var timeEl = document.getElementById('time');
	var serviceEl = document.getElementById('service');
	var dentistEl = document.getElementById('dentist');
	var summaryEl = document.getElementById('summary');

	var today = new Date();
	var iso = today.toISOString().slice(0,10);
	dateEl.value = iso;

	function generateSlots() {
		timeEl.innerHTML = '';
		var base = 9; // 9AM to 5PM
		for (var i = 0; i < 16; i++) {
			var hours = base + Math.floor(i/2);
			var minutes = (i % 2) ? '30' : '00';
			var label = (hours < 10 ? '0' + hours : hours) + ':' + minutes;
			var option = document.createElement('option');
			option.value = label;
			option.textContent = label;
			timeEl.appendChild(option);
		}
	}
	generateSlots();

	function renderSummary() {
		summaryEl.textContent = serviceEl.value + ' with ' + dentistEl.value + ' on ' + dateEl.value + ' at ' + timeEl.value;
	}
	[dateEl, timeEl, serviceEl, dentistEl].forEach(function (el) { el.addEventListener('change', renderSummary); });
	renderSummary();

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		var appt = {
			id: 'A' + Math.random().toString(36).slice(2, 9).toUpperCase(),
			date: dateEl.value,
			time: timeEl.value,
			service: serviceEl.value,
			dentist: dentistEl.value,
			status: 'Booked'
		};
		var list = JSON.parse(localStorage.getItem('appointments') || '[]');
		list.push(appt);
		localStorage.setItem('appointments', JSON.stringify(list));
		alert('Appointment booked!\n\n' + appt.id + ' — ' + appt.date + ' ' + appt.time);
		window.location.href = 'patient-portal.html';
	});
})();

(function initPortalLogin() {
	var form = document.getElementById('loginForm');
	if (!form) return;
	form.addEventListener('submit', function (e) {
		e.preventDefault();
		var role = document.getElementById('role').value;
		localStorage.setItem('role', role);
		if (role === 'patient') window.location.href = 'patient-portal.html';
		else if (role === 'staff') window.location.href = 'staff-portal.html';
		else window.location.href = 'admin-dashboard.html';
	});
})();

(function initPatientPortal() {
	var table = document.getElementById('apptTable');
	if (!table) return;
	function render() {
		var list = JSON.parse(localStorage.getItem('appointments') || '[]');
		var tbody = table.querySelector('tbody');
		tbody.innerHTML = '';
		list.forEach(function (a) {
			var tr = document.createElement('tr');
			tr.innerHTML = '<td>' + a.id + '</td><td>' + a.date + '</td><td>' + a.time + '</td><td>' + a.service + '</td><td>' + a.dentist + '</td><td>' + a.status + '</td><td><button data-id="' + a.id + '" class="btn">Cancel</button></td>';
			tbody.appendChild(tr);
		});
	}
	table.addEventListener('click', function (e) {
		if (e.target.tagName === 'BUTTON') {
			var id = e.target.getAttribute('data-id');
			var list = JSON.parse(localStorage.getItem('appointments') || '[]');
			list = list.map(function (a) { if (a.id === id) a.status = 'Cancelled'; return a; });
			localStorage.setItem('appointments', JSON.stringify(list));
			render();
		}
	});
	render();
})();

(function initStaffPortal() {
	var table = document.getElementById('staffApptTable');
	if (!table) return;
	var dateEl = document.getElementById('staffDate');
	var filterBtn = document.getElementById('filter');
	function render() {
		var list = JSON.parse(localStorage.getItem('appointments') || '[]');
		var date = dateEl.value;
		var tbody = table.querySelector('tbody');
		tbody.innerHTML = '';
		list.filter(function (a) { return !date || a.date === date; }).forEach(function (a) {
			var tr = document.createElement('tr');
			tr.innerHTML = '<td>' + a.id + '</td><td>' + a.date + '</td><td>' + a.time + '</td><td>' + a.service + '</td><td>' + a.dentist + '</td><td>' + a.status + '</td>';
			tbody.appendChild(tr);
		});
	}
	dateEl.value = new Date().toISOString().slice(0,10);
	filterBtn.addEventListener('click', render);
	render();
})();

(function initAdmin() {
	var totalEl = document.getElementById('kpiTotal');
	if (!totalEl) return;
	var upcomingEl = document.getElementById('kpiUpcoming');
	var cancelledEl = document.getElementById('kpiCancelled');
	var bar = document.getElementById('monthBar');
	var list = JSON.parse(localStorage.getItem('appointments') || '[]');
	var today = new Date().toISOString().slice(0,10);
	var total = list.length;
	var upcoming = list.filter(function (a) { return a.date >= today && a.status === 'Booked'; }).length;
	var cancelled = list.filter(function (a) { return a.status === 'Cancelled'; }).length;
	totalEl.textContent = total;
	upcomingEl.textContent = upcoming;
	cancelledEl.textContent = cancelled;
	var fill = Math.min(100, (upcoming / Math.max(1, total)) * 100);
	bar.style.width = fill + '%';
})();

