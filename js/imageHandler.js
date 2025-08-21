// 이미지 처리 관리
class ImageHandler {
    // 이미지 로드 및 물리 객체 생성
    static loadImages() {
        let allImagesLoaded = [];
        
        CONFIG.IMAGE_DATA.forEach((item, index) => {
            const img = new Image();
            img.onload = function() {
                // 이미지 크기 조정 (태블릿 이상에서는 고정 크기)
                const actualWidth = document.documentElement.clientWidth;
                const actualHeight = document.documentElement.clientHeight;
                
                let scale;
                if (actualWidth >= 768) { // 태블릿 이상 크기
                    scale = Math.min(actualWidth, actualHeight) / 1200;
                } else { // 모바일
                    scale = Math.min(actualWidth, actualHeight) / 900;
                }
                const width = this.naturalWidth * scale;
                const height = this.naturalHeight * scale;
                
                // 이미지 정보 저장
                allImagesLoaded[index] = {
                    item: item,
                    width: width,
                    height: height,
                    scale: scale
                };
                
                const loadedCount = PhysicsManager.incrementLoadedImages();
                
                // 모든 이미지가 로드되면 동시에 생성
                if (loadedCount === CONFIG.IMAGE_DATA.length) {
                    ImageHandler.createAllImages(allImagesLoaded);
                    PhysicsManager.startSimulation();
                }
            };
            img.src = item.path;
        });
    }
    
    // 모든 이미지를 동시에 생성 (브라우저 안에서 겹치지 않게)
    static createAllImages(allImagesLoaded) {
        const actualWidth = document.documentElement.clientWidth;
        const actualHeight = document.documentElement.clientHeight;
        const Bodies = Matter.Bodies;
        const World = Matter.World;
        
        const cols = Math.ceil(Math.sqrt(allImagesLoaded.length)); // 격자 열 수
        const rows = Math.ceil(allImagesLoaded.length / cols); // 격자 행 수
        
        allImagesLoaded.forEach((imageInfo, index) => {
            // 격자 위치 계산
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            // 브라우저 상단 영역을 격자로 나누어 위치 계산 (화면 안에서)
            const cellWidth = actualWidth / cols;
            const cellHeight = actualHeight / (rows + 2); // 여유 공간 추가
            
            const x = (col + 0.5) * cellWidth; // 격자 중앙
            const y = (row + 0.5) * cellHeight; // 브라우저 상단부터 시작
            
            // 랜덤 회전각 (-90도 ~ 90도)
            const randomAngle = (Math.random() - 0.5) * Math.PI;
            
            // 물리 객체 생성
            const body = Bodies.rectangle(x, y, imageInfo.width, imageInfo.height, {
                restitution: CONFIG.PHYSICS.restitution,
                friction: CONFIG.PHYSICS.friction,
                frictionAir: CONFIG.PHYSICS.frictionAir,
                angle: randomAngle,
                render: {
                    sprite: {
                        texture: imageInfo.item.path,
                        xScale: imageInfo.scale,
                        yScale: imageInfo.scale
                    }
                }
            });
            
            // 링크 정보를 body에 저장
            body.imageLink = imageInfo.item.link;
            
            PhysicsManager.addImageObject(body);
            World.add(PhysicsManager.getWorld(), body);
        });
    }
} 