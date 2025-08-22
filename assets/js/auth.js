(function(){
	function getDoctors(){
		try { return JSON.parse(localStorage.getItem('doctors') || '[]'); } catch(e){ return []; }
	}
	function saveDoctors(list){ localStorage.setItem('doctors', JSON.stringify(list)); }
	function setAuthDoctor(doctor){ localStorage.setItem('authDoctor', JSON.stringify(doctor)); }
	function getAuthDoctor(){ try { return JSON.parse(localStorage.getItem('authDoctor') || 'null'); } catch(e){ return null; } }
	function clearAuth(){ localStorage.removeItem('authDoctor'); }

	function ensureDefaultDoctor(){
		const doctors = getDoctors();
		if (!doctors.length){
			const defaultDoc = { fullName: 'Dr. John Smith', email: 'drsmith@example.com', password: 'password123' };
			saveDoctors([defaultDoc]);
		}
	}

	function initLoginPage(){
		ensureDefaultDoctor();
		const form = document.getElementById('loginForm');
		if(!form) return;
		form.addEventListener('submit', function(e){
			e.preventDefault();
			const email = document.getElementById('email').value.trim().toLowerCase();
			const password = document.getElementById('password').value;
			const doctors = getDoctors();
			const match = doctors.find(d => d.email.toLowerCase() === email && d.password === password);
			if (match){
				setAuthDoctor({ fullName: match.fullName, email: match.email });
				window.location.href = 'dashboard.html';
			} else {
				alert('Invalid credentials. Try drsmith@example.com / password123');
			}
		});
	}

	function initRegisterPage(){
		const form = document.getElementById('registerForm');
		if(!form) return;
		form.addEventListener('submit', function(e){
			e.preventDefault();
			const fullName = document.getElementById('fullName').value.trim();
			const email = document.getElementById('email').value.trim().toLowerCase();
			const password = document.getElementById('password').value;
			const doctors = getDoctors();
			if (doctors.some(d => d.email.toLowerCase() === email)){
				alert('An account with this email already exists. Please login.');
				window.location.href = 'login.html';
				return;
			}
			doctors.push({ fullName, email, password });
			saveDoctors(doctors);
			setAuthDoctor({ fullName, email });
			window.location.href = 'dashboard.html';
		});
	}

	function requireAuth(){
		const current = getAuthDoctor();
		if (!current){ window.location.href = 'login.html'; }
		return current;
	}

	function initLogout(btn){
		if (!btn) return;
		btn.addEventListener('click', function(){
			clearAuth();
			window.location.href = 'login.html';
		});
	}

	// expose
	window.initLoginPage = initLoginPage;
	window.initRegisterPage = initRegisterPage;
	window.requireAuth = requireAuth;
	window.getAuthDoctor = getAuthDoctor;
	window.initLogout = initLogout;
})();