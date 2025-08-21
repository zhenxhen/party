// 페이지 관리
class PageManager {
    // Enroll에서 파티 페이지로 전환
    static enterParty() {
        document.getElementById('enrollPage').style.display = 'none';
        document.getElementById('partyPage').style.display = 'block';
        document.getElementById('countdown').style.display = 'none'; // 카운트다운 숨기기
        
        if (!AppState.isPartyStarted) {
            AppState.isPartyStarted = true;
            // 파티 페이지 초기화
            this.initializeParty();
        }
    }

    // 파티 페이지 초기화 함수
    static initializeParty() {
        PhysicsManager.init();
        PhysicsManager.createBoundaries();
        ImageHandler.loadImages();
        GyroscopeManager.requestGyroPermission();
        InteractionManager.setupMouseInteraction();
    }
}

// 이벤트 관리자
class EventManager {
    static init() {
        this.setupPopupEvents();
        this.setupWindowEvents();
    }

    // 팝업 배경 클릭시 닫기 이벤트 설정
    static setupPopupEvents() {
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('popupOverlay').addEventListener('click', function(e) {
                if (e.target === this) {
                    PopupManager.closePopup();
                }
            });
            
            document.getElementById('mapPopupOverlay').addEventListener('click', function(e) {
                if (e.target === this) {
                    PopupManager.closeMapPopup();
                }
            });
            
            document.getElementById('musicPopupOverlay').addEventListener('click', function(e) {
                if (e.target === this) {
                    PopupManager.closeMusicPopup();
                }
            });
            
            document.getElementById('enrollFormPopup').addEventListener('click', function(e) {
                if (e.target === this) {
                    EnrollmentManager.closeEnrollForm();
                }
            });
        });
    }

    // 윈도우 이벤트 설정
    static setupWindowEvents() {
        // 브라우저 크기 변경 대응
        window.addEventListener('resize', () => {
            if (AppState.isPartyStarted) {
                PhysicsManager.handleResize();
            }
        });

        // 페이지 로드 시 카운트다운 시작
        window.addEventListener('load', () => {
            CountdownManager.startCountdown();
        });
    }
}

// 애플리케이션 초기화
class App {
    static init() {
        EventManager.init();
        console.log('Party App initialized');
    }
}

// 전역 함수들 (HTML에서 직접 호출되는 함수들)
function showEnrollForm() {
    EnrollmentManager.showEnrollForm();
}

function skipToParty() {
    EnrollmentManager.skipToParty();
}

function validateEnrollForm() {
    EnrollmentManager.validateEnrollForm();
}

function submitEnrollForm() {
    EnrollmentManager.submitEnrollForm();
}

function openPlaylist() {
    PopupManager.openPlaylist();
}

// 앱 시작
App.init(); 