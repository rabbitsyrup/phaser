import Phaser from 'phaser';
import { MainScene } from './scene/mainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 160,
  height: 160,
  backgroundColor: 0x000,
  scene: [MainScene],
  audio: {
    noAudio: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false
    }
  }
};

new Phaser.Game(config);