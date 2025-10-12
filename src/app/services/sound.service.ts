import { Injectable } from '@angular/core';

export interface SoundOption {
  id: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioContext: AudioContext | null = null;
  private volume: number = 0.5; // 0 to 1

  soundOptions: SoundOption[] = [
    { id: 'bell', name: 'Cloche douce', description: 'Une cloche mélodieuse' },
    { id: 'chime', name: 'Carillon', description: 'Son cristallin apaisant' },
    { id: 'gentle', name: 'Doux rappel', description: 'Son subtil et discret' },
    { id: 'classic', name: 'Classique', description: 'Bip traditionnel' },
    { id: 'nature', name: 'Nature', description: 'Son inspiré de la nature' },
    { id: 'modern', name: 'Moderne', description: 'Son électronique contemporain' }
  ];

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.volume;
  }

  playSound(soundId: string = 'bell') {
    if (!this.audioContext) {
      this.initAudioContext();
      if (!this.audioContext) return;
    }

    try {
      switch (soundId) {
        case 'bell':
          this.playBellSound();
          break;
        case 'chime':
          this.playChimeSound();
          break;
        case 'gentle':
          this.playGentleSound();
          break;
        case 'classic':
          this.playClassicSound();
          break;
        case 'nature':
          this.playNatureSound();
          break;
        case 'modern':
          this.playModernSound();
          break;
        default:
          this.playBellSound();
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }

  private playBellSound() {
    if (!this.audioContext) return;

    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator1.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.8);

    oscillator2.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.8);

    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.2);

    oscillator1.start(this.audioContext.currentTime);
    oscillator2.start(this.audioContext.currentTime);
    oscillator1.stop(this.audioContext.currentTime + 1.2);
    oscillator2.stop(this.audioContext.currentTime + 1.2);
  }

  private playChimeSound() {
    if (!this.audioContext) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (octave higher)
    let startTime = this.audioContext.currentTime;

    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext!.currentTime);
        gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext!.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.3);

        oscillator.start(this.audioContext!.currentTime);
        oscillator.stop(this.audioContext!.currentTime + 0.3);
      }, index * 150);
    });
  }

  private playGentleSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);

    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(550, this.audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(660, this.audioContext.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.15, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.8);
  }

  private playClassicSound() {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  private playNatureSound() {
    if (!this.audioContext) return;

    const oscillators: OscillatorNode[] = [];
    const gainNode = this.audioContext.createGain();


    const baseFreq = 220;
    const harmonics = [1, 1.5, 2, 2.5];

    harmonics.forEach((harmonic) => {
      const oscillator = this.audioContext!.createOscillator();
      oscillators.push(oscillator);

      oscillator.connect(gainNode);
      oscillator.frequency.setValueAtTime(baseFreq * harmonic, this.audioContext!.currentTime);
    });

    gainNode.connect(this.audioContext!.destination);

    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.audioContext!.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 1.5);

    oscillators.forEach(oscillator => {
      oscillator.start(this.audioContext!.currentTime);
      oscillator.stop(this.audioContext!.currentTime + 1.5);
    });
  }

  private playModernSound() {
    if (!this.audioContext) return;

    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);

    oscillator1.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    oscillator1.frequency.setValueAtTime(1000, this.audioContext.currentTime + 0.1);

    oscillator2.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator2.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(this.volume * 0.25, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

    oscillator1.start(this.audioContext.currentTime);
    oscillator2.start(this.audioContext.currentTime);
    oscillator1.stop(this.audioContext.currentTime + 0.4);
    oscillator2.stop(this.audioContext.currentTime + 0.4);
  }
  previewSound(soundId: string) {
    this.playSound(soundId);
  }
  getCurrentSound(): string {
    return localStorage.getItem('habitTracker-sound') || 'bell';
  }


  setCurrentSound(soundId: string) {
    localStorage.setItem('habitTracker-sound', soundId);
  }
}
