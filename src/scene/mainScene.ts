export class MainScene extends Phaser.Scene {
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

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
    var config = {
      key: "heroLeft",
      frames: this.anims.generateFrameNumbers("hero", {
        start: 0,
        end: 2,
        first: 0
      }),
      frameRate: 5,
      repeat: -1
    };
    this.anims.create(config);
    this.player = this.physics.add.sprite(spawnPoint.x as number, spawnPoint.y as number, "hero").play("heroLeft");

    this.physics.add.collider(this.player, terrainLayer);
  }

  update(time: number, delta: number): void {

  }

  destroy(): void {

  }
}