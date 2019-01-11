'use strict';

const gestureEngine = (function() {
  const regions = new WeakMap();
  const buttonMap = Object.freeze({
    0: 'leftclick',
    1: 'middleclick',
    2: 'rightclick',
  });

  const gestures = {
    tap(activeRegion) {
      const { activeTouches, activeButtons, callbacks } = regions.get(activeRegion);
      let validTap = false;

      activeRegion.addEventListener('pointerdown', (event) => {
        if (activeButtons.has('leftclick') || activeTouches.length === 1) {
          validTap = true;
        } else {
          validTap = false;
        }
      });

      activeRegion.addEventListener('pointermove', (event) => {
        validTap = false;
      });

      activeRegion.addEventListener('pointerup', (event) => {
        if (validTap) {
          callbacks.tap.forEach(cb => cb(event.x, event.y));
        }
      });
    },
    /**
     * Triggered via the following actions:
     * - Right Click Drag
     * - Two touch drag
     * - Scroll Events from a touchpad (e.g. similar to a Mac)
     */
    pan(activeRegion) {
      const { activeTouches, activeButtons, callbacks } = regions.get(activeRegion);
      let validPan = false;

      // Called on pointerup/pointercancel event
      function deactivatePan(event) {
        if (!activeButtons.has('rightclick') && activeTouches.length === 0) {
          validPan = false;
        }
      }

      activeRegion.addEventListener('pointerdown', (event) => {
        if (activeButtons.has('rightclick') || activeTouches.length > 0) {
          validPan = true;
        } else {
          validPan = false;   // Triggers if more than two fingers hit the active region
        }
      });

      activeRegion.addEventListener('pointermove', (event) => {
        const movementX = (activeTouches[0] || {}).movementX || event.movementX;
        const movementY = (activeTouches[0] || {}).movementY || event.movementY;

        if (validPan) {
          callbacks.pan.forEach(cb => cb(movementX, movementY));
        }
      });

      activeRegion.addEventListener('pointerup', deactivatePan);
      activeRegion.addEventListener('pointercancel', deactivatePan);
    },
    /**
     * Uses two fingers pinching in or out, scroll wheel
     */
    // pinch() {

    // },
    // /**
    //  * Left click, one finger tap
    //  */
    // tap() {
    //   const { activeTouches, callbacks } = regions.get(activeRegion);

    //   activeRegion.addEventListener('pointerdown', (event) => {

    //   });

    //   activeRegion.addEventListener('pointermove', (event) => {

    //   });

    //   activeRegion.addEventListener('pointerup', (event) => {

    //   });

    //   activeRegion.addEventListener('pointercancel', (event) => {

    //   });
    // },
  };

  /**
   * Keep track of input states relevant to gestures.
   */
  function monitorState(activeRegion) {
    const { activeTouches, activeButtons, monitored } = regions.get(activeRegion);

    function setState(event) {
      if (event.pointerType === 'touch') {
        const i = activeTouches.findIndex(e => e.pointerId === event.pointerId);
        if (i !== -1) {
          activeTouches[i] = event;
        } else {
          activeTouches.push(event);
        }
      }

      if (event.pointerType === 'mouse' && event.button !== -1) {
        activeButtons.add(buttonMap[event.button]);
      }
    }

    function cleanupState(event) {
      if (event.pointerType === 'touch') {
        const i = activeTouches.findIndex(e => e.pointerId === event.pointerId);
        if (i !== -1) {
          activeTouches.splice(i, 1);
        }
        // activeTouches.splice(activeTouches.findIndex(e => e.pointerId === event.pointerId), 1);
      }

      if (event.pointerType === 'mouse') {
        activeButtons.delete(buttonMap[event.button]);
      }
    }

    /* Ensures event listeners aren't duplicated on the same region */

    if (!monitored) {
      regions.get(activeRegion).monitored = true;

      activeRegion.addEventListener('pointerdown', setState);
      activeRegion.addEventListener('pointermove', setState);
      activeRegion.addEventListener('pointerup', cleanupState);
      activeRegion.addEventListener('pointercancel', cleanupState);
    }
  }

  return {
    setRegion(region) {
      this.activeRegion = region;

      if (!regions.has(region)) {
        regions.set(region, {
          activeTouches: [],
          activeButtons: new Set(),
          callbacks: {},
          monitored: false,
        });
        monitorState(region);
      }
    },
    on(gesture, cb) {
      if (!this.activeRegion) {
        throw new Error('No Region Set');
      }

      if (!gestures[gesture]) {
        throw new Error('Gesture doesn\'t exist');
      }

      const { callbacks } = regions.get(this.activeRegion);
      if (!callbacks[gesture]) {
        callbacks[gesture] = [];
      }

      callbacks[gesture].push(cb);
      gestures[gesture](this.activeRegion);
    },
    // off(gesture, cb) {

    // },
    disableContextMenu() {
      this.activeRegion.addEventListener('contextmenu', (event) => event.preventDefault());
    },
  };
})();