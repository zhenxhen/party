// 등록 관리
class EnrollmentManager {
    // 이미 등록된 사용자용 - 바로 파티 페이지로 이동
    static skipToParty() {
        this.applyUsernameFontStyle('mate');
        PageManager.enterParty();
    }

    // Enroll 폼 팝업 표시
    static showEnrollForm() {
        document.getElementById('enrollFormPopup').style.display = 'flex';
        this.validateEnrollForm(); // 초기 상태 검증
    }

    // Enroll 폼 팝업 닫기
    static closeEnrollForm() {
        document.getElementById('enrollFormPopup').style.display = 'none';
    }

    // Enroll 폼 유효성 검사
    static validateEnrollForm() {
        const userName = document.getElementById('userName').value;
        const userPhone = document.getElementById('userPhone').value;
        const enrollButton = document.getElementById('enrollButton');
        
        // 조건: 이름 1글자 이상, 번호 11글자
        const isNameValid = userName.trim().length >= 1;
        const isPhoneValid = userPhone.replace(/\D/g, '').length === 11; // 숫자만 11글자
        
        if (isNameValid && isPhoneValid) {
            enrollButton.classList.add('active');
        } else {
            enrollButton.classList.remove('active');
        }
    }

    // 한글 여부 확인 함수
    static isKorean(text) {
        const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        return koreanRegex.test(text);
    }

    // 사용자명에 맞는 폰트 적용
    static applyUsernameFontStyle(userName) {
        const usernameElements = document.querySelectorAll('.info h3');
        if (usernameElements.length > 1) {
            const usernameElement = usernameElements[1];
            usernameElement.textContent = userName;
            
            if (this.isKorean(userName)) {
                usernameElement.style.fontFamily = CONFIG.FONTS.korean;
            } else {
                usernameElement.style.fontFamily = CONFIG.FONTS.english;
            }
        }
    }

    // 구글 시트로 데이터 전송 (중복 방지)
    static sendToGoogleSheets(name, phone) {
        const params = new URLSearchParams({
            name: name,
            phone: phone
        });
        
        const requestUrl = `${CONFIG.GOOGLE_SHEETS_URL}?${params.toString()}`;
        
        // fetch 시도
        fetch(requestUrl, { 
            method: 'GET',
            mode: 'no-cors'
        }).then(() => {
            console.log('Data sent successfully via fetch');
        }).catch((error) => {
            console.log('Fetch failed, trying image tag method');
            
            // fetch 실패시에만 이미지 태그 사용
            const img = new Image();
            img.onload = function() {
                console.log('Data sent successfully via image tag');
            };
            img.onerror = function() {
                console.log('Data sent via image tag (response blocked but likely saved)');
            };
            img.src = requestUrl;
        });
    }

    // Enroll 폼 제출
    static submitEnrollForm() {
        const enrollButton = document.getElementById('enrollButton');
        
        // 이미 제출 중이면 중단
        if (AppState.isSubmitting) {
            console.log('Already submitting, please wait...');
            return;
        }
        
        // active 상태가 아니면 제출하지 않음
        if (!enrollButton.classList.contains('active')) {
            return;
        }
        
        // 제출 시작 - 중복 방지 플래그 설정
        AppState.isSubmitting = true;
        enrollButton.textContent = 'enrolling...';
        enrollButton.style.opacity = '0.5';
        enrollButton.style.cursor = 'not-allowed';
        
        const userName = document.getElementById('userName').value;
        const userPhone = document.getElementById('userPhone').value;
        
        console.log(`Submitting enrollment for: ${userName}, ${userPhone}`);
        
        // 구글 시트로 데이터 전송
        this.sendToGoogleSheets(userName, userPhone);
        
        // 사용자 이름을 파티 페이지에 반영하고 적절한 폰트 적용
        this.applyUsernameFontStyle(userName);
        
        // 잠시 대기 후 폼 닫고 파티 페이지로 이동
        setTimeout(() => {
            this.closeEnrollForm();
            PageManager.enterParty();
            
            // 제출 완료 - 플래그 리셋 (다음 사용자를 위해)
            AppState.isSubmitting = false;
            enrollButton.textContent = 'enroll';
            enrollButton.style.opacity = '1';
            enrollButton.style.cursor = 'pointer';
        }, 1000);
    }
} 