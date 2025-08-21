// 애플리케이션 설정값들
const CONFIG = {
    // 파티 날짜
    PARTY_DATE: new Date(2025, 8, 6, 19, 0, 0), // 2025년 9월 6일 오후 7시
    
    // 폰트 설정
    FONTS: {
        korean: '"dunkel-sans-cond-rounded", sans-serif',
        english: '"Sunflower", sans-serif'
    },
    
    // 구글 시트 URL
    GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/AKfycbyYuD4ThJ__c4kirch1kMvday2Lsmzx8vwxhZH4xzVje5DI9_WZn3KH9ymO8HMLVkq7/exec',
    
    // 물리 엔진 설정
    PHYSICS: {
        gravity: { x: 0, y: 1 },
        restitution: 0.6,
        friction: 0.3,
        frictionAir: 0.01,
        gyroMultiplier: 0.015
    },
    
    // 이미지 데이터
    IMAGE_DATA: [
        { path: 'img/calendar.png', link: 'calendar-event' },
        { path: 'img/glass.png', link: 'show-popup' },
        { path: 'img/host.png', link: 'instagram://user?username=eeezeen' },
        { path: 'img/map.png', link: 'show-map-popup' },
        { path: 'img/photo.png', link: 'photos-redirect://www.icloud.com/sharedalbum/#B2I5oqs3qIi1Kwo' },
        { path: 'img/playllist.png', link: 'show-music-popup' }
    ],
    
    // 애플뮤직 링크
    APPLE_MUSIC: {
        app: 'music://music.apple.com/kr/playlist/pl.u-XkD04qMcD9kXpbZ?a=join&it=8zaXrp0SB74egvoi4Z74W',
        web: 'https://music.apple.com/kr/playlist/pl.u-XkD04qMcD9kXpbZ?a=join&it=8zaXrp0SB74egvoi4Z74W'
    },
    
    // 인스타그램 링크
    INSTAGRAM: {
        web: 'https://www.instagram.com/eeezeen/'
    },
    
    // 캘린더 이벤트 정보
    CALENDAR_EVENT: {
        title: "Mate🎉",
        description: "See you at the party!",
        location: "Sungsu-dong (TBD)",
        startTime: new Date(2025, 8, 6, 19, 0, 0),
        endTime: new Date(2025, 8, 6, 23, 0, 0),
        url: "https://www.eeezeen.com"
    }
};

// 전역 상태 관리
const AppState = {
    currentPage: 'enroll',
    gyroEnabled: false,
    physicsInitialized: false,
    isPartyStarted: false,
    isSubmitting: false,
    user: {
        name: '',
        phone: ''
    }
}; 