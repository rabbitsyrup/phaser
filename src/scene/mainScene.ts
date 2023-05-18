export class MainScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  switch: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  wall: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  wallCollider: Phaser.Physics.Arcade.Collider;
  heart: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  playerDirection: String;
  isSwitchOn: Boolean;
  cursor: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'main', active: true });
  }

  preload(): void {
    this.load.image('tiles','assets/images/map/map.png'); //맵 이미지
    this.load.tilemapTiledJSON('map',"assets/images/map/map.json"); //맵 정보

    // 맵 (오브젝트로 쓰기 위해서 tile맵이랑 별도로 sprite 이미지로 로딩)
    this.load.spritesheet('mapObject', 'assets/images/map/map.png', { 
      frameWidth: 16, 
      frameHeight: 16,
    });

    // 주인공
    this.load.spritesheet('hero', 'assets/images/player/hero.png', { 
      frameWidth: 16, 
      frameHeight: 16,
      startFrame: 0,
      endFrame: 8
    });
  }

  create(): void {
    // sprite 움직임 생성
    // 주인공
    this.anims.create({
      key: "heroLeft",
      frames: this.anims.generateFrameNumbers("hero", {
        start: 0,
        end: 2,
        first: 0
      }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: "heroRight",
      frames: this.anims.generateFrameNumbers("hero", {
        start: 3,
        end: 5,
        first: 3
      }),
      frameRate: 5,
      repeat: -1
    });
    // 스위치
    this.anims.create({
      key: "switchOn",
      frames: this.anims.generateFrameNumbers("mapObject", {frames: [3, 11]}),
      frameRate: 5,
      repeat: 0
    });
    this.anims.create({
      key: "switchOff",
      frames: this.anims.generateFrameNumbers("mapObject", {frames: [11, 3]}),
      frameRate: 5,
      repeat: 0
    });
    // 벽
    this.anims.create({
      key: "wallDisappear",
      frames: this.anims.generateFrameNumbers("mapObject", {frames: [23, 22, 21, 20]}),
      frameRate: 5,
      repeat: 0
    });

    // 맵 생성
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("map", "tiles") as Phaser.Tilemaps.Tileset;

    const terrainLayer = map.createLayer("terrain", tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
    terrainLayer.setCollisionByProperty({ collides: true });

    // static 객체
    // 레이저
    const laser1Point = map.findObject("Objects", obj => obj.name === "laser1") as Phaser.Types.Tilemaps.TiledObject;
    const laser2Point = map.findObject("Objects", obj => obj.name === "laser2") as Phaser.Types.Tilemaps.TiledObject;
    const laser3Point = map.findObject("Objects", obj => obj.name === "laser3") as Phaser.Types.Tilemaps.TiledObject;
    const laser = this.physics.add.staticGroup();
    laser.create(laser1Point.x as number, laser1Point.y as number, "mapObject", 13);
    laser.create(laser2Point.x as number, laser2Point.y as number, "mapObject", 14);
    laser.create(laser3Point.x as number, laser3Point.y as number, "mapObject", 15);

    // 벽
    const wallPoint = map.findObject("Objects", obj => obj.name === "wall") as Phaser.Types.Tilemaps.TiledObject;
    this.wall = this.physics.add.staticSprite(wallPoint.x as number, wallPoint.y as number, "mapObject", 23);

    // 스위치
    const switchPoint = map.findObject("Objects", obj => obj.name === "switch") as Phaser.Types.Tilemaps.TiledObject;
    this.switch = this.physics.add.staticSprite(switchPoint.x as number, switchPoint.y as number, "mapObject", 3);
    this.isSwitchOn = false;

    // dynamic 객체
    // 하트
    const heartPoint = map.findObject("Objects", obj => obj.name === "heart") as Phaser.Types.Tilemaps.TiledObject;
    this.heart = this.physics.add.staticSprite(heartPoint.x as number, heartPoint.y as number, "mapObject", 4);
    
    // 스노우볼
    const snowballPoint = map.findObject("Objects", obj => obj.name === "snowball") as Phaser.Types.Tilemaps.TiledObject;
    const snowball = this.physics.add.sprite(snowballPoint.x as number, snowballPoint.y as number, "mapObject", 6);
    // 충돌 설정
    this.physics.add.collider(snowball, terrainLayer);

    // 주인공
    const heroPoint = map.findObject("Objects", obj => obj.name === "hero") as Phaser.Types.Tilemaps.TiledObject;
    this.player = this.physics.add.sprite(heroPoint.x as number, heroPoint.y as number, "hero").play("heroLeft");
    this.playerDirection = "left";
    // 충돌 설정
    this.physics.add.collider(this.player, terrainLayer); // 지형
    this.physics.add.collider(this.player, snowball); // 스노우볼
    this.wallCollider = this.physics.add.collider(this.player, this.wall); // 벽
    this.physics.add.collider(this.player, laser, this.hitByLaser, null, this); // 레이저
    this.physics.add.overlap(this.player, this.switch, this.toggleSwitch, null, this); // 스위치
    this.physics.add.overlap(this.player, this.heart, this.eatHeart, null, this); // 하트

    // 키보드 설정
    this.cursor = this.input.keyboard.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
  }

  // 하트 이벤트
  eatHeart(): void {
    this.player.setTint(0xffc0cb);
    this.heart.disableBody(true, true);
  }

  // 레이저 이벤트
  hitByLaser(): void {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.player.disableBody(true, false);
  }

  // 스위치 이벤트
  toggleSwitch(): void {
    // 일단 토글 말고 1회성으로, 토글은 무한대로 동작하는거 제어법 생각을 좀 해야될 것 같음
    if(this.isSwitchOn) {
      //this.switch.play("switchOff");
    } else {
      this.switch.play("switchOn");

      //this.wall.disableBody(true, true);
      this.wall.play("wallDisappear");
      this.physics.world.removeCollider(this.wallCollider);
    }

    //this.isSwitchOn = !this.isSwitchOn;
    this.isSwitchOn = true;
  }

  update(time: number, delta: number): void {
    // Stop any previous movement from the last frame
    this.player.body.setVelocityX(0);

    // Horizontal movement
    if (this.cursor.left.isDown) {
      this.player.body.setVelocityX(-100);
      if(this.playerDirection == "right") {
        this.player.play("heroLeft");
        this.playerDirection = "left";
      }
    } else if (this.cursor.right.isDown) {
      this.player.body.setVelocityX(100);
      if(this.playerDirection == "left") {
        this.player.play("heroRight");
        this.playerDirection = "right";
      }
    }
    
    // Vertical movement
    if (this.cursor.space.isDown && this.player.body.onFloor()) {
      this.player.body.setVelocityY(-300);
    }
  }

  destroy(): void {

  }
}