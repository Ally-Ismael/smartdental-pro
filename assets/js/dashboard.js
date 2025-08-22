(function(){
	const mockBookings = [
		{ id: 'B-2001', time: 'Today 10:00', patientName: 'John Doe', reason: 'Tooth pain', status: 'Confirmed', doctorEmail: 'drsmith@example.com' },
		{ id: 'B-2002', time: 'Today 11:30', patientName: 'Lerato Kapenda', reason: 'Cleaning', status: 'Confirmed', doctorEmail: 'drsmith@example.com' },
		{ id: 'B-2003', time: 'Today 14:00', patientName: 'Pieter van Wyk', reason: 'Crown consult', status: 'Pending', doctorEmail: 'drjane@example.com' }
	];

	const mockPatients = {
		'P-1001': { id: 'P-1001', name: 'John Doe', age: 36, allergies: ['Penicillin'], conditions: ['Hypertension'], surgeries: ['Wisdom tooth extraction (2019)'], currentMedications: ['Amlodipine 5mg OD'], lastVisitNotes: 'Treated for gingivitis; advised improved flossing.' },
		'P-1002': { id: 'P-1002', name: 'Lerato Kapenda', age: 28, allergies: [], conditions: [], surgeries: [], currentMedications: [], lastVisitNotes: 'Routine cleaning; follow-up in 6 months.' },
		'P-1003': { id: 'P-1003', name: 'Pieter van Wyk', age: 45, allergies: ['NSAIDs'], conditions: ['Type 2 Diabetes'], surgeries: ['Crown placement (2022)'], currentMedications: ['Metformin 500mg BD'], lastVisitNotes: 'Sensitivity noted on tooth 36; consider RCT if persists.' }
	};

	function renderBookingsForDoctor(doctorEmail){
		const rowsHost = document.querySelector('#bookingsTable tbody');
		if (!rowsHost) return;
		rowsHost.innerHTML = '';
		const myBookings = mockBookings.filter(b => b.doctorEmail.toLowerCase() === doctorEmail.toLowerCase());
		document.getElementById('bookingCount').textContent = String(myBookings.length);
		if (!myBookings.length){
			const tr = document.createElement('tr');
			const td = document.createElement('td');
			td.colSpan = 4;
			td.textContent = 'No upcoming bookings assigned to you.';
			tr.appendChild(td);
			rowsHost.appendChild(tr);
			return;
		}
		myBookings.forEach(b => {
			const tr = document.createElement('tr');
			tr.innerHTML = `<td>${b.time}</td><td>${b.patientName}</td><td>${b.reason}</td><td>${b.status}</td>`;
			rowsHost.appendChild(tr);
		});
	}

	function formatList(items){ return items && items.length ? items.join(', ') : 'None'; }

	function generateHistorySummary(p){
		return `Patient ${p.name} (${p.id}), age ${p.age}. Allergies: ${formatList(p.allergies)}. Conditions: ${formatList(p.conditions)}. Surgeries: ${formatList(p.surgeries)}. Current meds: ${formatList(p.currentMedications)}. Last visit: ${p.lastVisitNotes}`;
	}

	function suggestPrescription(patient, symptomsText){
		symptomsText = (symptomsText || '').toLowerCase();
		const suggestions = [];
		const warnings = [];

		// Example logic for dental scenarios
		if (symptomsText.includes('abscess') || symptomsText.includes('infection')){
			if (patient.allergies.map(a=>a.toLowerCase()).includes('penicillin')){
				warnings.push('Penicillin allergy present. Avoid amoxicillin.');
				suggestions.push('Consider clindamycin 300mg every 6 hours for 5 days (verify per guidelines).');
			} else {
				suggestions.push('Amoxicillin 500mg every 8 hours for 5 days (verify per guidelines).');
			}
			suggestions.push('Analgesia: Paracetamol 1g every 6-8 hours PRN pain.');
		}
		if (symptomsText.includes('pain') || symptomsText.includes('toothache')){
			if (patient.allergies.map(a=>a.toLowerCase()).includes('nsaids')){
				warnings.push('NSAID allergy present. Avoid ibuprofen.');
				suggestions.push('Consider paracetamol alone; avoid NSAIDs.');
			} else {
				suggestions.push('Ibuprofen 400mg every 8 hours with food, if not contraindicated.');
			}
		}
		if (patient.conditions.map(c=>c.toLowerCase()).includes('diabetes')){
			warnings.push('Diabetes: monitor glycemic control and infection risk.');
		}

		if (!suggestions.length){
			suggestions.push('No specific suggestions based on input. Use clinical judgment.');
		}
		return { suggestions, warnings };
	}

	function initDashboardPage(){
		const doctor = window.requireAuth ? window.requireAuth() : null;
		if (!doctor) return;
		document.getElementById('doctorIdentity').textContent = `${doctor.fullName} (${doctor.email})`;
		if (window.initLogout){ window.initLogout(document.getElementById('logoutBtn')); }
		renderBookingsForDoctor(doctor.email);

		const patientBtn = document.getElementById('fetchPatientBtn');
		const patientResult = document.getElementById('patientResult');
		patientBtn.addEventListener('click', function(){
			const pid = document.getElementById('patientIdInput').value.trim();
			const p = mockPatients[pid];
			if (!p){
				patientResult.innerHTML = `<div class="helper">Patient not found. Try IDs: P-1001, P-1002, P-1003</div>`;
				return;
			}
			const summary = generateHistorySummary(p);
			patientResult.innerHTML = `
				<div style="background:#f8f9fa; border:1px solid #eee; border-radius:12px; padding:15px;">
					<div><strong>${p.name}</strong> • ${p.id}</div>
					<div class="small">Age ${p.age} • Allergies: ${formatList(p.allergies)}</div>
					<div class="small">Conditions: ${formatList(p.conditions)}</div>
					<div class="small">Surgeries: ${formatList(p.surgeries)}</div>
					<div class="small">Medications: ${formatList(p.currentMedications)}</div>
					<div class="small">Last visit: ${p.lastVisitNotes}</div>
					<div style="margin-top:10px; padding:10px; background:#fff; border-radius:8px;">
						<strong>AI History Summary:</strong>
						<div>${summary}</div>
					</div>
				</div>
			`;
		});

		const rxBtn = document.getElementById('suggestRxBtn');
		const rxOut = document.getElementById('rxSuggestions');
		rxBtn.addEventListener('click', function(){
			const pid = document.getElementById('patientIdInput').value.trim();
			const p = mockPatients[pid];
			const symptoms = document.getElementById('symptomsInput').value.trim();
			if (!p){
				rxOut.innerHTML = `<div class="helper">Lookup a patient first to tailor suggestions (e.g. P-1001).</div>`;
				return;
			}
			const { suggestions, warnings } = suggestPrescription(p, symptoms);
			rxOut.innerHTML = `
				<div style="background:#fff; border:1px solid #eee; border-radius:12px; padding:12px;">
					${warnings.length ? `<div style='color:#d63031; margin-bottom:8px;'><strong>Warnings:</strong> ${warnings.join(' | ')}</div>` : ''}
					<div><strong>Suggested Plan:</strong>
						<ul style="margin-left:16px;">
							${suggestions.map(s=>`<li>${s}</li>`).join('')}
						</ul>
					</div>
					<div class="helper">Prototype only. Confirm dosing and indications per local guidelines.</div>
				</div>
			`;
		});
	}

	// expose
	window.initDashboardPage = initDashboardPage;
})();