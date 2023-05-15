import Phaser from 'phaser';
import { MainScene } from './scene/mainScene';

const config: Phaser.Types.Core.GameConfig = {

  type: Phaser.AUTO,
  width: 160,
  height: 160,
  backgroundColor: 0x000,
  scene: [MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
};

new Phaser.Game(config);