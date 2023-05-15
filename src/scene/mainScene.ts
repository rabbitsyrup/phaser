export class MainScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  playerDirection: String;
  cursor: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'main', active: true });
  }

  preload(): void {
    this.load.image('tiles','assets/images/map/map.png');
    this.load.tilemapTiledJSON('map',"assets/images/map/map.json");

    this.load.spritesheet('hero', 'assets/images/player/hero.png', { frameWidth: 16, frameHeight: 16,
      startFrame: 0,
      endFrame: 8 });
  }

  create(): void {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("map", "tiles") as Phaser.Tilemaps.Tileset;

    const terrainLayer = map.createLayer("terrain", tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
    terrainLayer.setCollisionByProperty({ collides: true });

    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point") as Phaser.Types.Tilemaps.TiledObject;
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
    this.player = this.physics.add.sprite(spawnPoint.x as number, spawnPoint.y as number, "hero").play("heroLeft");
    this.playerDirection = "left";

    this.physics.add.collider(this.player, terrainLayer);

    this.cursor = this.input.keyboard.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
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