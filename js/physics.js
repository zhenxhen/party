// 물리 엔진 관리
class PhysicsManager {
    static engine = null;
    static world = null;
    static render = null;
    static imageObjects = [];
    static loadedImages = 0;

    // Matter.js 초기화
    static init() {
        // Matter.js 모듈들
        const Engine = Matter.Engine;
        const Render = Matter.Render;
        const World = Matter.World;
        const Bodies = Matter.Bodies;

        // 엔진 생성
        this.engine = Engine.create();
        this.world = this.engine.world;
        
        // 기본 중력 설정 (아래쪽으로)
        this.engine.world.gravity.x = CONFIG.PHYSICS.gravity.x;
        this.engine.world.gravity.y = CONFIG.PHYSICS.gravity.y;

        // 캔버스와 렌더러 설정
        const canvas = document.getElementById('world');
        this.render = Render.create({
            canvas: canvas,
            engine: this.engine,
            options: {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
                wireframes: false,
                background: 'transparent',
                showAngleIndicator: false,
                showVelocity: false
            }
        });
    }

    // 바닥과 벽 생성 (안보이게)
    static createBoundaries() {
        const actualWidth = document.documentElement.clientWidth;
        const actualHeight = document.documentElement.clientHeight;
        const Bodies = Matter.Bodies;
        const World = Matter.World;
        
        const ground = Bodies.rectangle(
            actualWidth / 2, 
            actualHeight + 50, 
            actualWidth + 200, 
            100, 
            { 
                isStatic: true, 
                restitution: 0.8,
                render: { visible: false }
            }
        );
        
        const leftWall = Bodies.rectangle(
            -50, 
            actualHeight / 2, 
            100, 
            actualHeight + 200, 
            { 
                isStatic: true, 
                restitution: 0.8,
                render: { visible: false }
            }
        );
        
        const rightWall = Bodies.rectangle(
            actualWidth + 50, 
            actualHeight / 2, 
            100, 
            actualHeight + 200, 
            { 
                isStatic: true, 
                restitution: 0.8,
                render: { visible: false }
            }
        );

        // 상단 천장 추가
        const ceiling = Bodies.rectangle(
            actualWidth / 2, 
            -300, 
            actualWidth + 200, 
            100, 
            { 
                isStatic: true, 
                restitution: 0.8,
                render: { visible: false }
            }
        );

        World.add(this.world, [ground, leftWall, rightWall, ceiling]);
    }

    // 브라우저 크기 변경 대응
    static handleResize() {
        const actualWidth = document.documentElement.clientWidth;
        const actualHeight = document.documentElement.clientHeight;
        
        // 캔버스 크기 조정
        this.render.canvas.width = actualWidth;
        this.render.canvas.height = actualHeight;
        this.render.options.width = actualWidth;
        this.render.options.height = actualHeight;
        
        // 기존 경계 제거
        const allBodies = this.world.bodies;
        const boundaries = allBodies.filter(body => body.isStatic);
        Matter.World.remove(this.world, boundaries);
        
        // 새로운 경계 생성
        this.createBoundaries();
    }

    // 시뮬레이션 시작
    static startSimulation() {
        const Render = Matter.Render;
        const Engine = Matter.Engine;
        
        // 렌더링 시작
        Render.run(this.render);
        
        // 엔진 실행
        Engine.run(this.engine);
    }

    // 전역 접근을 위한 getter들
    static getEngine() {
        return this.engine;
    }

    static getWorld() {
        return this.world;
    }

    static getImageObjects() {
        return this.imageObjects;
    }

    static addImageObject(obj) {
        this.imageObjects.push(obj);
    }

    static incrementLoadedImages() {
        this.loadedImages++;
        return this.loadedImages;
    }

    static getLoadedImagesCount() {
        return this.loadedImages;
    }
} 