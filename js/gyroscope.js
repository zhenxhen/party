// 자이로스코프 관리
class GyroscopeManager {
    static gyroPermissionGranted = false;
    static gyroData = { beta: 0, gamma: 0 };

    // 자이로 센서 권한 요청 및 초기화
    static async requestGyroPermission() {
        const engine = PhysicsManager.getEngine();
        
        // 기본 중력 확보 (자이로 센서 여부와 관계없이)
        engine.world.gravity.x = CONFIG.PHYSICS.gravity.x;
        engine.world.gravity.y = CONFIG.PHYSICS.gravity.y;
        
        // iOS 13+ 에서 DeviceMotionEvent 권한 요청
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceMotionEvent.requestPermission();
                if (permission === 'granted') {
                    this.gyroPermissionGranted = true;
                    this.initializeGyroscope();
                    console.log('자이로 센서 권한이 허용되었습니다.');
                } else {
                    console.log('자이로 센서 권한이 거부되었습니다.');
                    this.gyroPermissionGranted = false;
                }
            } catch (error) {
                console.log('자이로 센서 권한 요청 중 오류:', error);
                this.gyroPermissionGranted = false;
            }
        } 
        // Android 및 기타 브라우저에서는 바로 초기화
        else if (window.DeviceOrientationEvent) {
            this.gyroPermissionGranted = true;
            this.initializeGyroscope();
            console.log('자이로 센서를 초기화했습니다.');
        } else {
            console.log('이 기기는 자이로 센서를 지원하지 않습니다.');
            this.gyroPermissionGranted = false;
        }
    }

    // 자이로스코프 이벤트 리스너 설정
    static initializeGyroscope() {
        if (!this.gyroPermissionGranted) return;

        window.addEventListener('deviceorientation', (event) => {
            // beta: 앞뒤 기울임 (-180 ~ 180)
            // gamma: 좌우 기울임 (-90 ~ 90)
            this.gyroData.beta = event.beta || 0;
            this.gyroData.gamma = event.gamma || 0;
            
            this.updateGravityFromGyro();
        });
    }

    // 자이로 데이터를 바탕으로 중력 방향 업데이트
    static updateGravityFromGyro() {
        const engine = PhysicsManager.getEngine();
        if (!engine || !this.gyroPermissionGranted) return;

        // 기본 중력값 (아래쪽으로)
        const baseGravityY = CONFIG.PHYSICS.gravity.y;
        const gravityMultiplier = CONFIG.PHYSICS.gyroMultiplier;

        // 자이로 데이터를 중력으로 변환
        // gamma (좌우 기울임)을 X축 중력으로 - 미세한 효과만
        const gravityX = (this.gyroData.gamma || 0) * gravityMultiplier;
        
        // beta는 기본적으로 90도 근처에서 평평한 상태
        // 기본 중력은 항상 아래쪽(+Y)으로 유지하고, 자이로는 미세 조정만
        const betaOffset = (this.gyroData.beta || 0) - 0; // 0도를 기준으로 계산
        const gravityY = baseGravityY + (betaOffset * gravityMultiplier * 0.5); // Y축 효과는 더 작게

        // 중력 업데이트 - Y는 항상 양수로 유지 (아래쪽으로)
        engine.world.gravity.x = gravityX;
        engine.world.gravity.y = Math.max(0.5, gravityY); // 최소 0.5로 아래쪽 중력 보장
    }
} 