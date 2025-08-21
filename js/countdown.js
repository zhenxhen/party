// 카운트다운 관리
class CountdownManager {
    static updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        let targetDate = CONFIG.PARTY_DATE;
        
        // 만약 올해 날짜가 이미 지났다면 내년으로 설정
        if (now > targetDate) {
            targetDate = new Date(currentYear + 1, 8, 6, 19, 0, 0);
        }
        
        const timeDiff = targetDate - now;
        
        if (timeDiff <= 0) {
            document.getElementById('countdown').textContent = '00:00:00';
            return;
        }
        
        const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        // 항상 시:분:초 형태로 표시
        const countdownText = `${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('countdown').textContent = countdownText;
    }

    static startCountdown() {
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    }
} 