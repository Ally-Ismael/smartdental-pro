function simulateChat(symptom) {
    const chatInterface = document.getElementById('chatInterface');

    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    userMessage.textContent = `I have ${symptom}`;
    chatInterface.appendChild(userMessage);

    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot-message';

        if (symptom === 'tooth pain') {
            botMessage.innerHTML = `I understand you're experiencing tooth pain. Based on your symptoms, I'm classifying this as <strong>URGENT</strong>. I can schedule you for an emergency appointment today at 2:00 PM. Would you like me to book this for you? 🦷⚡`;
        } else if (symptom === 'cleaning') {
            botMessage.innerHTML = `Great! Regular cleanings are important for dental health. I can schedule your routine cleaning for next week. Available slots: Tuesday 10:00 AM, Wednesday 2:30 PM, or Friday 9:15 AM. Which works best? 🧼✨`;
        } else if (symptom === 'emergency') {
            botMessage.innerHTML = `This sounds like a dental emergency! 🚨 I'm immediately booking you for our next emergency slot today at 1:30 PM. I'm also notifying Dr. Smith right now. Please head to the clinic ASAP. What's your current pain level (1-10)?`;
        }

        chatInterface.appendChild(botMessage);
        chatInterface.scrollTop = chatInterface.scrollHeight;
    }, 1500);

    chatInterface.scrollTop = chatInterface.scrollHeight;
}
