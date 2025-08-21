// 인터랙션 관리
class InteractionManager {
    // 마우스 및 터치 인터랙션 설정
    static setupMouseInteraction() {
        const engine = PhysicsManager.getEngine();
        const render = PhysicsManager.render;
        const Mouse = Matter.Mouse;
        const MouseConstraint = Matter.MouseConstraint;
        const Events = Matter.Events;
        const World = Matter.World;
        
        // 마우스 제어 추가 (드래그 가능)
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.8,
                render: {
                    visible: false
                }
            }
        });
        
        World.add(PhysicsManager.getWorld(), mouseConstraint);
        
        // 드래그 상태 추적 변수들
        let mouseDownPosition = null;
        let isDragging = false;
        let mouseDownTime = 0;
        
        // 마우스 다운 이벤트
        Events.on(mouseConstraint, 'mousedown', function(event) {
            mouseDownPosition = { x: event.mouse.position.x, y: event.mouse.position.y };
            mouseDownTime = Date.now();
            isDragging = false;
        });
        
        // 마우스 업 이벤트 (클릭 감지)
        Events.on(mouseConstraint, 'mouseup', function(event) {
            if (mouseDownPosition) {
                const currentPosition = event.mouse.position;
                const distance = Math.sqrt(
                    Math.pow(currentPosition.x - mouseDownPosition.x, 2) + 
                    Math.pow(currentPosition.y - mouseDownPosition.y, 2)
                );
                const timeDiff = Date.now() - mouseDownTime;
                
                // 짧은 시간(300ms 이하)이고 거리가 짧으면(10px 이하) 클릭으로 판단
                if (distance < 10 && timeDiff < 300 && !isDragging) {
                    const bodiesUnderMouse = Matter.Query.point(PhysicsManager.getImageObjects(), currentPosition);
                    
                    if (bodiesUnderMouse.length > 0) {
                        const clickedBody = bodiesUnderMouse[0];
                        InteractionManager.handleImageClick(clickedBody);
                    }
                }
            }
            
            mouseDownPosition = null;
            isDragging = false;
        });
        
        // 드래그 감지
        Events.on(mouseConstraint, 'mousemove', function(event) {
            if (mouseDownPosition && mouseConstraint.body) {
                const currentPosition = event.mouse.position;
                const distance = Math.sqrt(
                    Math.pow(currentPosition.x - mouseDownPosition.x, 2) + 
                    Math.pow(currentPosition.y - mouseDownPosition.y, 2)
                );
                
                if (distance > 5) {
                    isDragging = true;
                }
            }
        });
    }

    // 이미지 클릭 처리
    static handleImageClick(clickedBody) {
        if (!clickedBody.imageLink) return;

        // 캘린더 이벤트인 경우 특별 처리
        if (clickedBody.imageLink === 'calendar-event') {
            CalendarManager.createCalendarEvent();
        }
        // 팝업 표시인 경우 특별 처리
        else if (clickedBody.imageLink === 'show-popup') {
            PopupManager.showPopup();
        }
        // 맵 팝업 표시인 경우 특별 처리
        else if (clickedBody.imageLink === 'show-map-popup') {
            PopupManager.showMapPopup();
        }
        // 음악 팝업 표시인 경우 특별 처리
        else if (clickedBody.imageLink === 'show-music-popup') {
            PopupManager.showMusicPopup();
        }
        // 인스타그램 딥링크인 경우 특별 처리
        else if (clickedBody.imageLink.startsWith('instagram://')) {
            const appLink = clickedBody.imageLink;
            const webFallback = CONFIG.INSTAGRAM.web;
            
            window.location.href = appLink;
            setTimeout(() => {
                window.open(webFallback, '_blank');
            }, 500);
        }
        // 사진 앱 딥링크인 경우 특별 처리
        else if (clickedBody.imageLink.startsWith('photos-redirect://')) {
            const appLink = clickedBody.imageLink;
            const webFallback = clickedBody.imageLink.replace('photos-redirect://', 'https://');
            
            window.location.href = appLink;
            setTimeout(() => {
                window.open(webFallback, '_blank');
            }, 500);
        }
        else {
            // 일반 링크는 새 창에서 열기
            window.open(clickedBody.imageLink, '_blank');
        }
    }
}

// 팝업 관리
class PopupManager {
    static showPopup() {
        document.getElementById('popupOverlay').style.display = 'flex';
    }

    static closePopup() {
        document.getElementById('popupOverlay').style.display = 'none';
    }

    static showMapPopup() {
        document.getElementById('mapPopupOverlay').style.display = 'flex';
    }

    static closeMapPopup() {
        document.getElementById('mapPopupOverlay').style.display = 'none';
    }

    static showMusicPopup() {
        document.getElementById('musicPopupOverlay').style.display = 'flex';
    }

    static closeMusicPopup() {
        document.getElementById('musicPopupOverlay').style.display = 'none';
    }

    static openPlaylist() {
        // 팝업 닫기
        this.closeMusicPopup();
        
        // 애플뮤직 앱 열기
        window.location.href = CONFIG.APPLE_MUSIC.app;
        setTimeout(() => {
            window.open(CONFIG.APPLE_MUSIC.web, '_blank');
        }, 500);
    }
}

// 캘린더 관리
class CalendarManager {
    // ICS 파일 생성 및 다운로드 함수
    static createCalendarEvent() {
        const event = CONFIG.CALENDAR_EVENT;
        
        // ICS 형식으로 날짜 변환
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        // ICS 파일 내용 생성
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Party//Party Event//EN
BEGIN:VEVENT
UID:${Date.now()}@party.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(event.startTime)}
DTEND:${formatDate(event.endTime)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
URL:${event.url}
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;

        // Blob 생성 및 다운로드
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'party-event.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
} 