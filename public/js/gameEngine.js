'use strict';

const gameEngine = (function() {
  const fpsMeter = new FPSMeter({
    heat: true,
    graph: true,
    theme: 'colorful',
  });
  const game = new GameOfLife(250, 250);
  const scenes = [];

  function render() {
    fpsMeter.tickStart();

    // Render each scene added to the engine in order
    scenes.forEach(scene => scene.render());

    fpsMeter.tick();
    window.requestAnimationFrame(render);
  }
  window.requestAnimationFrame(render);

  let timer;
  let lastTick = 0;

  return {
    game,
    speed: 1000 / 20,    // Frequency in milliseconds logic loop should run at
    start() {
      timer = setInterval(() => {
        const now = performance.now();
        const delta = now - lastTick;

        if (delta > this.speed) {
          game.tick();
          lastTick = now;
        }
      }, 0);
    },
    pause() {
      clearInterval(timer);
    },
    hideFps() {
      fpsMeter.hide();
    },
    showFps() {
      fpsMeter.show();
    },
    addScene(scene) {
      scenes.push(scene);
    },
    removeScene(scene) {
      delete scenes[scenes.indexOf(scene)];
    },
  };
})();
