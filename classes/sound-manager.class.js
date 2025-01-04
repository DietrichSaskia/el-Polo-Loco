class SoundManager {
 
  constructor() {
    this.audios = {};
    this.isMuted = false;
    this.defaultVolume = 0.1;
  }

  /**
   * Adds an audio file to the manager.
   *
   * @param {string} sound - The URL or path to the audio file.
   */
  addSound(sound) {
    if (!this.audios[sound]) {
      const audio = new Audio(sound);
      audio.volume = this.defaultVolume;
      audio.muted = this.isMuted;

      audio.addEventListener('error', (e) => {
        console.warn(`Error loading audio file: ${sound}`, e);
      });
      this.audios[sound] = audio;
    }
  }

  /**
   * Plays an audio file.
   *
   * @param {string} sound - The URL or path to the audio file.
   */
  playSound(sound) {
    if (!this.audios[sound]) {
      this.addSound(sound);
    }
    this.audios[sound].play().catch((error) => {
      console.warn(`Error playing audio file: ${sound}`, error);
    });
  }

  /**
   * Pauses a specific audio file.
   *
   * @param {string} sound - The URL or path to the audio file.
   */
  pauseSound(sound) {
    if (this.audios[sound]) {
      this.audios[sound].pause();
    }
  }

  /**
   * Toggles the mute state for all audio files.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    Object.values(this.audios).forEach((audio) => {
      audio.muted = this.isMuted;
    });
    this.updateMuteButton();
  }

  /**
   * Updates the mute button icon based on the current mute state.
   */
  updateMuteButton() {
    const toggleBtn = document.getElementById("toggleSound");
    if (this.isMuted) {
      toggleBtn.src = "./assets/icons/mute.png";
    } else {
      toggleBtn.src = "./assets/icons/laud.png";
    }
  }

  /**
   * Pauses all currently playing audio files.
   */
  pauseAllSounds() {
    Object.values(this.audios).forEach((audio) => {
      audio.pause();
    });
    this.updateMuteButton();
  }

  /**
   * Unmutes all audio files and restores the default volume.
   */
  unmuteAll() {
    this.isMuted = false;
    Object.values(this.audios).forEach((audio) => {
      audio.muted = false;
      audio.volume = this.defaultVolume;
    });
    this.updateMuteButton();
  }
}