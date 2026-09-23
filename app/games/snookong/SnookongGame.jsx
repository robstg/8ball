'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Trophy, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Share2, 
  Info, 
  Flame, 
  ShieldAlert, 
  HelpCircle, 
  X, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus
} from 'lucide-react';

const V_WIDTH = 450;
const V_HEIGHT = 800;
const CUSHION_WIDTH = 26;
const BALL_RADIUS = 10.5;
const POCKET_RADIUS = 22;
const CUE_SPEED = 4.8; // Calibrated speed for strategic reflex control
const OBJECT_FRICTION = 0.988; // Realistic cloth rolling friction
const PADDLE_WIDTH = 88;
const PADDLE_HEIGHT = 14;
const PADDLE_Y = 736;
// Table-center colors (Brown/Pink/Blue/Black) all share x=225, same as the
// table's visual center. Resting the paddle dead-center means a straight
// (0 degree) shot collides with a color before it ever reaches the reds —
// an instant, near-guaranteed foul on the most obvious first shot. Offsetting
// the default aim keeps the straight-shot lane inside the reds pack instead.
const PADDLE_DEFAULT_X = 253;

const SNOOKER_COLORS = {
  RED: { name: 'Red', value: 1, hex: '#e11d48', darkHex: '#881337', specular: '#fda4af' },
  YELLOW: { name: 'Yellow', value: 2, hex: '#eab308', darkHex: '#854d0e', specular: '#fef08a' },
  GREEN: { name: 'Green', value: 3, hex: '#16a34a', darkHex: '#14532d', specular: '#bbf7d0' },
  BROWN: { name: 'Brown', value: 4, hex: '#92400e', darkHex: '#451a03', specular: '#fde68a' },
  BLUE: { name: 'Blue', value: 5, hex: '#2563eb', darkHex: '#1e3a8a', specular: '#bfdbfe' },
  PINK: { name: 'Pink', value: 6, hex: '#ec4899', darkHex: '#831843', specular: '#fbcfe8' },
  BLACK: { name: 'Black', value: 7, hex: '#18181b', darkHex: '#09090b', specular: '#71717a' },
  WHITE: { name: 'Cue Ball', value: 0, hex: '#f8fafc', darkHex: '#94a3b8', specular: '#ffffff' }
};

const COLOR_SPOTS = {
  BLACK: { x: 225, y: 105 },
  PINK: { x: 225, y: 228 },
  BLUE: { x: 225, y: 390 },
  BROWN: { x: 225, y: 620 },
  GREEN: { x: 170, y: 620 },
  YELLOW: { x: 280, y: 620 }
};

const CLEARANCE_SEQUENCE = ['YELLOW', 'GREEN', 'BROWN', 'BLUE', 'PINK', 'BLACK'];

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playCueClack() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  playBallClick(intensity = 1.0) {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const vol = Math.min(0.45, Math.max(0.08, 0.32 * intensity));
      osc.frequency.setValueAtTime(2600, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.035);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  playCushionThud() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  playPocketDrop(colorValue = 1) {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 220 + colorValue * 30;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.22);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  playBreakExplosion() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [2200, 1600, 1100].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const startT = now + idx * 0.015;
        osc.frequency.setValueAtTime(freq, startT);
        osc.frequency.exponentialRampToValueAtTime(450, startT + 0.07);
        gain.gain.setValueAtTime(0.35, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startT);
        osc.stop(startT + 0.07);
      });
    } catch (e) {}
  }

  playFoulBuzzer() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(90, now + 0.14);
      gain.gain.setValueAtTime(0.34, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playVictoryFanfare() {
    if (!this.enabled || !this.ctx) return;
    try {
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + idx * 0.12;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      });
    } catch (e) {}
  }
}

export default function SnookongGame() {
  const canvasRef = useRef(null);
  const soundRef = useRef(new SoundEngine());

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [score, setScore] = useState(0);
  const [currentBreak, setCurrentBreak] = useState(0);
  const [highestBreak, setHighestBreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [targetBallType, setTargetBallType] = useState('RED'); 
  const [redsLeft, setRedsLeft] = useState(10);
  const [gameState, setGameState] = useState('BREAK_AIM'); // 'BREAK_AIM', 'PLAYING', 'BALL_IN_HAND', 'GAMEOVER', 'VICTORY'
  const [foulBanner, setFoulBanner] = useState(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [historyPots, setHistoryPots] = useState([]);
  const [copiedToast, setCopiedToast] = useState(false);
  // All-time best score, persisted in localStorage so it survives reloads
  // and new visits — the current highestBreak state only tracks this session.
  const [personalBest, setPersonalBest] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);

  // Offset angle relative to straight up (-50° to +50°, 0° = straight towards top cushion)
  const [aimOffsetDeg, setAimOffsetDeg] = useState(0);

  const engineRef = useRef({
    gameState: 'BREAK_AIM', // State mirror to eliminate frame race conditions
    aimOffsetDeg: 0,
    paddle: {
      x: PADDLE_DEFAULT_X,
      y: PADDLE_Y,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      targetX: PADDLE_DEFAULT_X,
      vx: 0
    },
    cueBall: {
      x: PADDLE_DEFAULT_X,
      y: PADDLE_Y - BALL_RADIUS - 7,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      active: false,
      potted: false,
      scale: 1.0
    },
    balls: [],
    pockets: [
      { id: 'top-left', x: CUSHION_WIDTH + 2, y: CUSHION_WIDTH + 2 },
      { id: 'top-right', x: V_WIDTH - CUSHION_WIDTH - 2, y: CUSHION_WIDTH + 2 },
      { id: 'mid-left', x: CUSHION_WIDTH - 4, y: 390 },
      { id: 'mid-right', x: V_WIDTH - CUSHION_WIDTH + 4, y: 390 },
      { id: 'bot-left', x: CUSHION_WIDTH + 2, y: 730 },
      { id: 'bot-right', x: V_WIDTH - CUSHION_WIDTH - 2, y: 730 }
    ],
    particles: [],
    targetState: 'RED',
    clearanceIndex: 0,
    redsRemaining: 10,
    score: 0,
    currentBreak: 0,
    highestBreak: 0,
    lives: 3,
    isBreakShot: true,
    firstBallStruck: null,
    potLog: []
  });

  const setupRack = useCallback(() => {
    const engine = engineRef.current;
    const balls = [];

    // 1. Official 6 Colors on designated spots
    Object.entries(COLOR_SPOTS).forEach(([colorKey, spot]) => {
      balls.push({
        id: colorKey.toLowerCase(),
        type: colorKey,
        x: spot.x,
        y: spot.y,
        vx: 0,
        vy: 0,
        radius: BALL_RADIUS,
        isColor: true,
        isPotted: false,
        scale: 1.0,
        spot: { ...spot }
      });
    });

    // 2. 10 Reds Pyramid (4-3-2-1 formation)
    const rDist = BALL_RADIUS * 2.05;
    const rowOffset = rDist * 0.866;
    const startX = 225;
    const baseY = 150;

    // Row 1 (Base - 4 reds)
    [-1.5, -0.5, 0.5, 1.5].forEach((offset, idx) => {
      balls.push({
        id: `red-r1-${idx}`,
        type: 'RED',
        x: startX + offset * rDist,
        y: baseY,
        vx: 0,
        vy: 0,
        radius: BALL_RADIUS,
        isColor: false,
        isPotted: false,
        scale: 1.0
      });
    });

    // Row 2 (3 reds)
    [-1, 0, 1].forEach((offset, idx) => {
      balls.push({
        id: `red-r2-${idx}`,
        type: 'RED',
        x: startX + offset * rDist,
        y: baseY + rowOffset,
        vx: 0,
        vy: 0,
        radius: BALL_RADIUS,
        isColor: false,
        isPotted: false,
        scale: 1.0
      });
    });

    // Row 3 (2 reds)
    [-0.5, 0.5].forEach((offset, idx) => {
      balls.push({
        id: `red-r3-${idx}`,
        type: 'RED',
        x: startX + offset * rDist,
        y: baseY + rowOffset * 2,
        vx: 0,
        vy: 0,
        radius: BALL_RADIUS,
        isColor: false,
        isPotted: false,
        scale: 1.0
      });
    });

    // Row 4 (Apex - 1 red) pointing down toward Baulk
    balls.push({
      id: 'red-apex',
      type: 'RED',
      x: startX,
      y: baseY + rowOffset * 3,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      isColor: false,
      isPotted: false,
      scale: 1.0
    });

    engine.balls = balls;
    engine.paddle.x = PADDLE_DEFAULT_X;
    engine.paddle.targetX = PADDLE_DEFAULT_X;
    engine.cueBall = {
      x: PADDLE_DEFAULT_X,
      y: PADDLE_Y - BALL_RADIUS - 7,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      active: false,
      potted: false,
      scale: 1.0
    };
    engine.gameState = 'BREAK_AIM';
    engine.aimOffsetDeg = 0;
    engine.targetState = 'RED';
    engine.clearanceIndex = 0;
    engine.redsRemaining = 10;
    engine.particles = [];
    engine.isBreakShot = true;
    engine.firstBallStruck = null;
    engine.potLog = [];

    setAimOffsetDeg(0);
    setRedsLeft(10);
    setTargetBallType('RED');
    setHistoryPots([]);
    setFoulBanner(null);
    setGameState('BREAK_AIM');
  }, []);

  const fireShot = useCallback(() => {
    soundRef.current.init();
    const engine = engineRef.current;
    
    if (engine.gameState !== 'BREAK_AIM' && engine.gameState !== 'BALL_IN_HAND') {
      return;
    }

    const currentOffset = engine.aimOffsetDeg;
    const rad = (-90 + currentOffset) * (Math.PI / 180);

    engine.cueBall.x = engine.paddle.x;
    engine.cueBall.y = engine.paddle.y - BALL_RADIUS - 7;
    engine.cueBall.vx = Math.cos(rad) * CUE_SPEED;
    engine.cueBall.vy = Math.sin(rad) * CUE_SPEED;
    engine.cueBall.active = true;
    engine.cueBall.potted = false;
    engine.cueBall.scale = 1.0;
    engine.firstBallStruck = null;

    if (engine.gameState === 'BREAK_AIM') {
      soundRef.current.playBreakExplosion();
      engine.isBreakShot = true;
    } else {
      soundRef.current.playCueClack();
      engine.isBreakShot = false;
    }

    engine.gameState = 'PLAYING';
    setGameState('PLAYING');
  }, []);

  const restartGame = () => {
    const engine = engineRef.current;
    setupRack();
    engine.score = 0;
    engine.currentBreak = 0;
    engine.highestBreak = 0;
    engine.lives = 3;
    setScore(0);
    setCurrentBreak(0);
    setHighestBreak(0);
    setLives(3);
    setFoulBanner(null);
    setIsNewBest(false);
  };

  const toggleSound = () => {
    soundRef.current.init();
    soundRef.current.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const updateAimAngle = (newOffset) => {
    const clamped = Math.max(-50, Math.min(50, newOffset));
    setAimOffsetDeg(clamped);
    engineRef.current.aimOffsetDeg = clamped;
  };

  const spawnParticles = (x, y, color) => {
    const engine = engineRef.current;
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3.2;
      engine.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2.2,
        color,
        alpha: 1.0,
        decay: 0.022 + Math.random() * 0.02
      });
    }
  };

  const handleFoul = (reason, penalty = 4) => {
    soundRef.current.playFoulBuzzer();
    const engine = engineRef.current;

    engine.score = Math.max(0, engine.score - penalty);
    engine.currentBreak = 0;
    engine.lives -= 1;

    setScore(engine.score);
    setCurrentBreak(0);
    setLives(engine.lives);

    setFoulBanner({ text: reason, penalty });
    setTimeout(() => {
      setFoulBanner(null);
    }, 2800);

    if (engine.lives <= 0) {
      engine.cueBall.active = false;
      engine.gameState = 'GAMEOVER';
      setGameState('GAMEOVER');
      return;
    }

    engine.cueBall.active = false;
    engine.cueBall.potted = false;
    engine.cueBall.scale = 1.0;
    engine.cueBall.vx = 0;
    engine.cueBall.vy = 0;
    engine.cueBall.x = engine.paddle.x;
    engine.cueBall.y = engine.paddle.y - BALL_RADIUS - 7;
    engine.firstBallStruck = null;

    engine.gameState = 'BALL_IN_HAND';
    setGameState('BALL_IN_HAND');
    updateAimAngle(0);
  };

  const respotBall = (ball) => {
    const engine = engineRef.current;
    let target = { ...ball.spot };
    
    const isBlocked = engine.balls.some(b => 
      !b.isPotted && b.id !== ball.id && 
      Math.hypot(b.x - target.x, b.y - target.y) < BALL_RADIUS * 2.2
    );

    if (isBlocked) {
      let testY = target.y - 28;
      if (testY < 65) testY = target.y + 28;
      target.y = testY;
    }

    ball.x = target.x;
    ball.y = target.y;
    ball.vx = 0;
    ball.vy = 0;
    ball.scale = 1.0;
    ball.isPotted = false;
  };

  const handlePotBall = (ball) => {
    const engine = engineRef.current;
    ball.isPotted = true;
    soundRef.current.playPocketDrop(SNOOKER_COLORS[ball.type]?.value || 1);
    spawnParticles(ball.x, ball.y, SNOOKER_COLORS[ball.type]?.hex || '#fff');

    if (engine.redsRemaining > 0) {
      if (engine.targetState === 'RED') {
        if (ball.type === 'RED') {
          engine.score += 1;
          engine.currentBreak += 1;
          if (engine.currentBreak > engine.highestBreak) engine.highestBreak = engine.currentBreak;
          engine.redsRemaining -= 1;
          engine.potLog.push('🔴');

          if (engine.redsRemaining === 0) {
            engine.targetState = 'YELLOW';
            setTargetBallType('YELLOW');
          } else {
            engine.targetState = 'ANY_COLOR';
            setTargetBallType('ANY_COLOR');
          }

          setScore(engine.score);
          setCurrentBreak(engine.currentBreak);
          setHighestBreak(engine.highestBreak);
          setRedsLeft(engine.redsRemaining);
          setHistoryPots([...engine.potLog]);
        } else {
          respotBall(ball);
          handleFoul(`Potted ${ball.type} while on RED`, Math.max(4, SNOOKER_COLORS[ball.type].value));
        }
      } else if (engine.targetState === 'ANY_COLOR') {
        if (ball.type !== 'RED') {
          const pts = SNOOKER_COLORS[ball.type].value;
          engine.score += pts;
          engine.currentBreak += pts;
          if (engine.currentBreak > engine.highestBreak) engine.highestBreak = engine.currentBreak;
          engine.potLog.push(getColorEmoji(ball.type));

          respotBall(ball);
          engine.targetState = 'RED';
          setTargetBallType('RED');
          setScore(engine.score);
          setCurrentBreak(engine.currentBreak);
          setHighestBreak(engine.highestBreak);
          setHistoryPots([...engine.potLog]);
        } else {
          handleFoul('Potted RED while on COLOR', 4);
        }
      }
    } else {
      const expectedType = CLEARANCE_SEQUENCE[engine.clearanceIndex];
      if (ball.type === expectedType) {
        const pts = SNOOKER_COLORS[ball.type].value;
        engine.score += pts;
        engine.currentBreak += pts;
        if (engine.currentBreak > engine.highestBreak) engine.highestBreak = engine.currentBreak;
        engine.potLog.push(getColorEmoji(ball.type));

        engine.clearanceIndex += 1;
        setScore(engine.score);
        setCurrentBreak(engine.currentBreak);
        setHighestBreak(engine.highestBreak);
        setHistoryPots([...engine.potLog]);

        if (engine.clearanceIndex >= CLEARANCE_SEQUENCE.length) {
          soundRef.current.playVictoryFanfare();
          engine.gameState = 'VICTORY';
          setGameState('VICTORY');
        } else {
          const nextTarget = CLEARANCE_SEQUENCE[engine.clearanceIndex];
          engine.targetState = nextTarget;
          setTargetBallType(nextTarget);
        }
      } else {
        respotBall(ball);
        handleFoul(`Wrong Ball: ${ball.type} (Expected ${expectedType})`, Math.max(4, SNOOKER_COLORS[ball.type].value));
      }
    }
  };

  const getColorEmoji = (type) => {
    switch (type) {
      case 'RED': return '🔴';
      case 'YELLOW': return '🟡';
      case 'GREEN': return '🟢';
      case 'BROWN': return '🟤';
      case 'BLUE': return '🔵';
      case 'PINK': return '🌸';
      case 'BLACK': return '⚫';
      default: return '⚪';
    }
  };

  // Load the saved personal best once, on mount. Wrapped in try/catch since
  // localStorage can throw in private-browsing modes or if it's disabled.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('snookong-best-score');
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!Number.isNaN(parsed)) setPersonalBest(parsed);
      }
    } catch (e) {}
  }, []);

  // Whenever the live score overtakes the stored best, save the new one.
  useEffect(() => {
    if (score > personalBest) {
      setPersonalBest(score);
      setIsNewBest(true);
      try {
        window.localStorage.setItem('snookong-best-score', String(score));
      } catch (e) {}
    }
  }, [score, personalBest]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        fireShot();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        updateAimAngle(engineRef.current.aimOffsetDeg - 5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        updateAimAngle(engineRef.current.aimOffsetDeg + 5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fireShot]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let pointerDownPos = null;

    const handlePointerDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointerDownPos = { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handlePointerUp = (e) => {
      if (!pointerDownPos) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      const curX = clientX - rect.left;
      const curY = clientY - rect.top;
      const dist = Math.hypot(curX - pointerDownPos.x, curY - pointerDownPos.y);

      if (dist < 10) {
        if (engineRef.current.gameState === 'BREAK_AIM' || engineRef.current.gameState === 'BALL_IN_HAND') {
          fireShot();
        }
      }
      pointerDownPos = null;
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const scaleX = V_WIDTH / rect.width;
      const canvasX = (clientX - rect.left) * scaleX;

      const minX = CUSHION_WIDTH + PADDLE_WIDTH / 2;
      const maxX = V_WIDTH - CUSHION_WIDTH - PADDLE_WIDTH / 2;
      const clampedX = Math.max(minX, Math.min(maxX, canvasX));
      engineRef.current.paddle.targetX = clampedX;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mouseup', handlePointerUp);
    canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
    canvas.addEventListener('touchend', handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchend', handlePointerUp);
    };
  }, [fireShot]);

  useEffect(() => {
    setupRack();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const runPhysicsLoop = () => {
      const engine = engineRef.current;

      const paddle = engine.paddle;
      const prevPaddleX = paddle.x;
      paddle.x += (paddle.targetX - paddle.x) * 0.42;
      paddle.vx = paddle.x - prevPaddleX;

      const cue = engine.cueBall;

      if (engine.gameState === 'BREAK_AIM' || engine.gameState === 'BALL_IN_HAND') {
        cue.x = paddle.x;
        cue.y = paddle.y - BALL_RADIUS - 7;
        cue.vx = 0;
        cue.vy = 0;
        cue.active = false;
      } else if (cue.active) {
        cue.x += cue.vx;
        cue.y += cue.vy;

        // Preserve calibrated constant cue speed (deliberate arcade feel)
        const speed = Math.hypot(cue.vx, cue.vy);
        if (speed > 0.001) {
          cue.vx = (cue.vx / speed) * CUE_SPEED;
          cue.vy = (cue.vy / speed) * CUE_SPEED;
        }

        if (cue.x - cue.radius <= CUSHION_WIDTH) {
          cue.x = CUSHION_WIDTH + cue.radius;
          cue.vx = Math.abs(cue.vx);
          soundRef.current.playCushionThud();
        } else if (cue.x + cue.radius >= V_WIDTH - CUSHION_WIDTH) {
          cue.x = V_WIDTH - CUSHION_WIDTH - cue.radius;
          cue.vx = -Math.abs(cue.vx);
          soundRef.current.playCushionThud();
        }

        if (cue.y - cue.radius <= CUSHION_WIDTH) {
          cue.y = CUSHION_WIDTH + cue.radius;
          cue.vy = Math.abs(cue.vy);
          soundRef.current.playCushionThud();
        }

        const paddleTop = paddle.y - paddle.height / 2;
        const paddleBottom = paddle.y + paddle.height / 2;
        const paddleLeft = paddle.x - paddle.width / 2;
        const paddleRight = paddle.x + paddle.width / 2;

        if (
          cue.vy > 0 &&
          cue.y + cue.radius >= paddleTop &&
          cue.y - cue.radius <= paddleBottom &&
          cue.x >= paddleLeft - 6 &&
          cue.x <= paddleRight + 6
        ) {
          cue.y = paddleTop - cue.radius;
          const hitOffset = (cue.x - paddle.x) / (paddle.width / 2);
          const maxBounceAngle = (66 * Math.PI) / 180;
          const bounceAngle = hitOffset * maxBounceAngle - Math.PI / 2;

          cue.vx = Math.cos(bounceAngle) * CUE_SPEED + paddle.vx * 0.2;
          cue.vy = Math.sin(bounceAngle) * CUE_SPEED;

          if (cue.vy > -1.5) cue.vy = -1.5;
          soundRef.current.playCushionThud();
        }

        if (cue.y - cue.radius > V_HEIGHT - 12) {
          handleFoul('Cue ball drained past paddle! Ball in hand.', 4);
        }

        engine.pockets.forEach(pocket => {
          const dist = Math.hypot(cue.x - pocket.x, cue.y - pocket.y);
          const captureRadius = POCKET_RADIUS - 3;
          if (dist < captureRadius) {
            // Only a genuine scratch if the cue ball is actually heading
            // toward the pocket (or has nearly stopped right in its mouth).
            // Without this, a normal rail bounce near a mid-table pocket
            // gets swallowed even though the ball is moving away from it.
            const toPocketX = pocket.x - cue.x;
            const toPocketY = pocket.y - cue.y;
            const approaching = cue.vx * toPocketX + cue.vy * toPocketY >= 0;
            const nearlyStopped = dist < captureRadius * 0.5;
            if (approaching || nearlyStopped) {
              handleFoul('In-off Pocket Scratch! Ball in hand.', 4);
            }
          }
        });
      }

      engine.balls.forEach(ball => {
        if (ball.isPotted) return;

        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vx *= OBJECT_FRICTION;
        ball.vy *= OBJECT_FRICTION;

        if (Math.hypot(ball.vx, ball.vy) < 0.035) {
          ball.vx = 0;
          ball.vy = 0;
        }

        if (ball.y > 660) {
          ball.vy -= 0.12;
          if (ball.y > 700) {
            ball.y = 700;
            ball.vy = -Math.abs(ball.vy || 1.2);
          }
        }

        if (ball.x - ball.radius <= CUSHION_WIDTH) {
          ball.x = CUSHION_WIDTH + ball.radius;
          ball.vx = Math.abs(ball.vx) * 0.84;
          soundRef.current.playCushionThud();
        } else if (ball.x + ball.radius >= V_WIDTH - CUSHION_WIDTH) {
          ball.x = V_WIDTH - CUSHION_WIDTH - ball.radius;
          ball.vx = -Math.abs(ball.vx) * 0.84;
          soundRef.current.playCushionThud();
        }

        if (ball.y - ball.radius <= CUSHION_WIDTH) {
          ball.y = CUSHION_WIDTH + ball.radius;
          ball.vy = Math.abs(ball.vy) * 0.84;
          soundRef.current.playCushionThud();
        } else if (ball.y + ball.radius >= V_HEIGHT - CUSHION_WIDTH - 18) {
          ball.y = V_HEIGHT - CUSHION_WIDTH - 18 - ball.radius;
          ball.vy = -Math.abs(ball.vy) * 0.84;
          soundRef.current.playCushionThud();
        }

        engine.pockets.forEach(pocket => {
          const dist = Math.hypot(ball.x - pocket.x, ball.y - pocket.y);
          if (dist < POCKET_RADIUS) {
            const toPocketX = pocket.x - ball.x;
            const toPocketY = pocket.y - ball.y;
            const approaching = ball.vx * toPocketX + ball.vy * toPocketY >= 0;
            const nearlyStopped = dist < POCKET_RADIUS * 0.5;
            if (approaching || nearlyStopped) {
              handlePotBall(ball);
            }
          }
        });
      });

      if (cue.active) {
        engine.balls.forEach(ball => {
          if (ball.isPotted) return;
          const dx = ball.x - cue.x;
          const dy = ball.y - cue.y;
          const dist = Math.hypot(dx, dy);

          if (dist < cue.radius + ball.radius && dist > 0) {
            if (!engine.firstBallStruck) {
              engine.firstBallStruck = ball;

              if (engine.isBreakShot) {
                if (ball.type !== 'RED') {
                  const penaltyVal = Math.max(4, SNOOKER_COLORS[ball.type]?.value || 4);
                  handleFoul(`Struck ${ball.type} first on Break! Ball in hand.`, penaltyVal);
                  return;
                } else {
                  engine.isBreakShot = false;
                }
              } else {
                if (engine.redsRemaining > 0 && engine.targetState === 'RED' && ball.type !== 'RED') {
                  const penaltyVal = Math.max(4, SNOOKER_COLORS[ball.type]?.value || 4);
                  handleFoul(`Struck ${ball.type} while on RED! Ball in hand.`, penaltyVal);
                  return;
                }
              }
            }

            // Standard 2D Elastic Collision (equal, energy-conserving impulse)
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (cue.radius + ball.radius) - dist;
            cue.x -= nx * (overlap * 0.5);
            cue.y -= ny * (overlap * 0.5);
            ball.x += nx * (overlap * 0.5);
            ball.y += ny * (overlap * 0.5);

            const kx = cue.vx - ball.vx;
            const ky = cue.vy - ball.vy;
            const p = 2 * (nx * kx + ny * ky) / 2;

            cue.vx -= p * nx;
            cue.vy -= p * ny;
            ball.vx += p * nx;
            ball.vy += p * ny;

            soundRef.current.playBallClick(Math.min(1.0, Math.hypot(ball.vx, ball.vy) / 3.5));
          }
        });
      }

      for (let i = 0; i < engine.balls.length; i++) {
        const b1 = engine.balls[i];
        if (b1.isPotted) continue;
        for (let j = i + 1; j < engine.balls.length; j++) {
          const b2 = engine.balls[j];
          if (b2.isPotted) continue;

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.hypot(dx, dy);

          if (dist < b1.radius + b2.radius && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (b1.radius + b2.radius) - dist;

            b1.x -= nx * (overlap * 0.5);
            b1.y -= ny * (overlap * 0.5);
            b2.x += nx * (overlap * 0.5);
            b2.y += ny * (overlap * 0.5);

            const kx = b1.vx - b2.vx;
            const ky = b1.vy - b2.vy;
            const p = (nx * kx + ny * ky);

            b1.vx -= p * nx * 0.94;
            b1.vy -= p * ny * 0.94;
            b2.vx += p * nx * 0.94;
            b2.vy += p * ny * 0.94;

            if (Math.abs(p) > 0.35) {
              soundRef.current.playBallClick(Math.min(1.0, Math.abs(p) / 3.5));
            }
          }
        }
      }

      for (let pIdx = engine.particles.length - 1; pIdx >= 0; pIdx--) {
        const p = engine.particles[pIdx];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          engine.particles.splice(pIdx, 1);
        }
      }

      drawCanvas(ctx, engine);

      animationFrameId = requestAnimationFrame(runPhysicsLoop);
    };

    animationFrameId = requestAnimationFrame(runPhysicsLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [setupRack]);

  const drawCanvas = (ctx, engine) => {
    ctx.clearRect(0, 0, V_WIDTH, V_HEIGHT);

    ctx.fillStyle = '#1c130d';
    ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

    ctx.fillStyle = '#2b160e';
    ctx.fillRect(8, 8, V_WIDTH - 16, V_HEIGHT - 16);

    const clothGrad = ctx.createRadialGradient(225, 400, 50, 225, 400, 480);
    clothGrad.addColorStop(0, '#15803d');
    clothGrad.addColorStop(0.75, '#166534');
    clothGrad.addColorStop(1, '#0e3e1f');
    ctx.fillStyle = clothGrad;
    ctx.fillRect(CUSHION_WIDTH, CUSHION_WIDTH, V_WIDTH - CUSHION_WIDTH * 2, V_HEIGHT - CUSHION_WIDTH * 2);

    ctx.fillStyle = '#064e3b';
    ctx.fillRect(CUSHION_WIDTH, CUSHION_WIDTH - 6, V_WIDTH - CUSHION_WIDTH * 2, 6);
    ctx.fillRect(CUSHION_WIDTH - 6, CUSHION_WIDTH, 6, V_HEIGHT - CUSHION_WIDTH * 2);
    ctx.fillRect(V_WIDTH - CUSHION_WIDTH, CUSHION_WIDTH, 6, V_HEIGHT - CUSHION_WIDTH * 2);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(CUSHION_WIDTH, 620);
    ctx.lineTo(V_WIDTH - CUSHION_WIDTH, 620);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(225, 620, 55, 0, Math.PI, false);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    Object.values(COLOR_SPOTS).forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    engine.pockets.forEach(p => {
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(p.x, p.y, POCKET_RADIUS + 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.arc(p.x, p.y, POCKET_RADIUS - 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    if (engine.gameState === 'BREAK_AIM' || engine.gameState === 'BALL_IN_HAND') {
      const rad = (-90 + engine.aimOffsetDeg) * (Math.PI / 180);
      drawTrajectoryGuide(ctx, engine.paddle.x, PADDLE_Y - BALL_RADIUS - 7, rad, engine);
      drawAuthenticCueStick(ctx, engine.paddle.x, PADDLE_Y - BALL_RADIUS - 7, rad);
    }

    const paddle = engine.paddle;
    const padL = paddle.x - paddle.width / 2;
    const padT = paddle.y - paddle.height / 2;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.roundRect(padL + 2, padT + 4, paddle.width, paddle.height, 6);
    ctx.fill();

    const padGrad = ctx.createLinearGradient(padL, padT, padL, padT + paddle.height);
    padGrad.addColorStop(0, '#38bdf8');
    padGrad.addColorStop(0.25, '#1e293b');
    padGrad.addColorStop(0.75, '#0f172a');
    padGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = padGrad;
    ctx.beginPath();
    ctx.roundRect(padL, padT, paddle.width, paddle.height, 6);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(paddle.x, paddle.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (engine.gameState === 'BREAK_AIM' || engine.gameState === 'BALL_IN_HAND') {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(paddle.x, PADDLE_Y - BALL_RADIUS - 7, BALL_RADIUS + 3.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    engine.particles.forEach(pt => {
      ctx.save();
      ctx.globalAlpha = pt.alpha;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    engine.balls.forEach(ball => {
      if (ball.isPotted) return;
      draw3DSphericalBall(ctx, ball.x, ball.y, ball.radius * ball.scale, SNOOKER_COLORS[ball.type]);
    });

    const cue = engine.cueBall;
    if (!cue.potted) {
      draw3DSphericalBall(ctx, cue.x, cue.y, cue.radius * cue.scale, SNOOKER_COLORS.WHITE);
    }
  };

  const drawAuthenticCueStick = (ctx, ballX, ballY, rad) => {
    ctx.save();
    ctx.translate(ballX, ballY);
    ctx.rotate(rad);

    const tipDist = BALL_RADIUS + 10;
    const cueLength = 120;
    const buttDist = tipDist + cueLength;

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(-2.2, tipDist, 4.4, 4, 1);
    ctx.fill();

    ctx.fillStyle = '#eab308';
    ctx.fillRect(-2.5, tipDist + 4, 5, 5);

    const shaftGrad = ctx.createLinearGradient(-3.5, tipDist + 9, 3.5, tipDist + 9);
    shaftGrad.addColorStop(0, '#fef3c7');
    shaftGrad.addColorStop(0.5, '#fde68a');
    shaftGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = shaftGrad;

    ctx.beginPath();
    ctx.moveTo(-2.5, tipDist + 9);
    ctx.lineTo(2.5, tipDist + 9);
    ctx.lineTo(4.8, buttDist - 28);
    ctx.lineTo(-4.8, buttDist - 28);
    ctx.closePath();
    ctx.fill();

    const buttGrad = ctx.createLinearGradient(-5, buttDist - 28, 5, buttDist - 28);
    buttGrad.addColorStop(0, '#18181b');
    buttGrad.addColorStop(0.5, '#27272a');
    buttGrad.addColorStop(1, '#09090b');
    ctx.fillStyle = buttGrad;

    ctx.beginPath();
    ctx.moveTo(-4.8, buttDist - 28);
    ctx.lineTo(4.8, buttDist - 28);
    ctx.lineTo(5.5, buttDist);
    ctx.lineTo(-5.5, buttDist);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#52525b';
    ctx.beginPath();
    ctx.roundRect(-5.5, buttDist, 11, 4, 2);
    ctx.fill();

    ctx.restore();
  };

  const drawTrajectoryGuide = (ctx, startX, startY, rad, engine) => {
    let currX = startX;
    let currY = startY;
    let vx = Math.cos(rad);
    let vy = Math.sin(rad);

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = engine.gameState === 'BREAK_AIM' ? '#38bdf8' : '#f59e0b';

    ctx.beginPath();
    ctx.moveTo(currX, currY);

    const step = 4;
    let hitBall = null;
    let hitPoint = null;

    for (let d = 0; d < 620; d += step) {
      currX += vx * step;
      currY += vy * step;

      if (currX <= CUSHION_WIDTH + BALL_RADIUS) {
        currX = CUSHION_WIDTH + BALL_RADIUS;
        vx = -vx;
        ctx.lineTo(currX, currY);
      } else if (currX >= V_WIDTH - CUSHION_WIDTH - BALL_RADIUS) {
        currX = V_WIDTH - CUSHION_WIDTH - BALL_RADIUS;
        vx = -vx;
        ctx.lineTo(currX, currY);
      }

      if (currY <= CUSHION_WIDTH + BALL_RADIUS) {
        currY = CUSHION_WIDTH + BALL_RADIUS;
        vy = -vy;
        ctx.lineTo(currX, currY);
      }

      for (const b of engine.balls) {
        if (b.isPotted) continue;
        const dist = Math.hypot(currX - b.x, currY - b.y);
        if (dist <= BALL_RADIUS * 2) {
          hitBall = b;
          hitPoint = { x: currX, y: currY };
          break;
        }
      }

      if (hitBall) break;
    }

    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.restore();

    if (hitPoint && hitBall) {
      ctx.save();
      ctx.strokeStyle = hitBall.type === 'RED' ? '#22c55e' : (engine.gameState === 'BREAK_AIM' ? '#ef4444' : '#eab308');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hitPoint.x, hitPoint.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      const defX = hitBall.x - hitPoint.x;
      const defY = hitBall.y - hitPoint.y;
      const defDist = Math.hypot(defX, defY) || 1;
      ctx.strokeStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(hitBall.x, hitBall.y);
      ctx.lineTo(hitBall.x + (defX / defDist) * 32, hitBall.y + (defY / defDist) * 32);
      ctx.stroke();
      ctx.restore();
    }
  };

  const draw3DSphericalBall = (ctx, x, y, radius, color) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x + 1.5, y + 2.5, radius * 0.95, radius * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();

    const grad = ctx.createRadialGradient(
      x - radius * 0.35,
      y - radius * 0.35,
      radius * 0.08,
      x,
      y,
      radius
    );
    grad.addColorStop(0, color.specular || '#ffffff');
    grad.addColorStop(0.32, color.hex);
    grad.addColorStop(0.88, color.darkHex || '#000000');
    grad.addColorStop(1, '#09090b');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.arc(x - radius * 0.32, y - radius * 0.32, radius * 0.22, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleCopyScore = () => {
    const today = new Date().toISOString().slice(0, 10);
    const potString = historyPots.slice(0, 16).join('') || '🔴';
    const text = `🎱 Snookong (${today})
Break: ${highestBreak} pts | Score: ${score}
Sequence: ${potString}
Reds Cleared: ${10 - redsLeft}/10 | Lives Left: ${lives}/3
Play on pottheblack.com/games/snookong`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2200);
      });
    }
  };

  const getTargetBadge = () => {
    if (targetBallType === 'RED') {
      return {
        label: 'ON: RED (+1)',
        bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
        dot: 'bg-rose-500 shadow-rose-500/50'
      };
    }
    if (targetBallType === 'ANY_COLOR') {
      return {
        label: 'ON: ANY COLOR',
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse',
        dot: 'bg-amber-400 shadow-amber-400/50'
      };
    }
    const col = SNOOKER_COLORS[targetBallType];
    return {
      label: `ON: ${col?.name.toUpperCase()} (+${col?.value})`,
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
      dot: 'bg-emerald-400'
    };
  };

  const badge = getTargetBadge();

  return (
    <div
      className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-2 sm:p-4 font-sans select-none overscroll-none"
      style={{
        minHeight: '100dvh',
        paddingTop: 'max(0.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(0.5rem, env(safe-area-inset-left))',
        paddingRight: 'max(0.5rem, env(safe-area-inset-right))',
        overscrollBehavior: 'none'
      }}
    >
      <header className="w-full max-w-[450px] flex items-center justify-between py-2 px-1 text-xs border-b border-neutral-800 mb-2">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center space-x-1 text-neutral-400 hover:text-emerald-400 transition-colors"
          >
            <ChevronLeft size={14} />
            <span className="font-semibold">Home</span>
          </Link>
          <span className="text-neutral-700">|</span>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold tracking-wider text-neutral-200 uppercase">
              <span className="hidden sm:inline">Pot The Black </span>
              <span className="text-emerald-400">/ Snookong</span>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {personalBest > 0 && (
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full"
              title="Your all-time best score"
            >
              <Trophy size={11} className="text-amber-400" />
              {personalBest}
            </span>
          )}
          <button 
            onClick={toggleSound}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button 
            onClick={() => setShowRulesModal(true)}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
            title="How to Play"
          >
            <HelpCircle size={16} />
          </button>
          <button 
            onClick={restartGame}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors"
            title="Reset Game"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </header>

      <div className="w-full max-w-[450px] grid grid-cols-4 gap-2 mb-2">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2 text-center shadow-inner">
          <div className="text-[10px] uppercase text-neutral-400 font-semibold tracking-wider">Score</div>
          <div className="text-lg font-black text-white">{score}</div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2 text-center shadow-inner">
          <div className="text-[10px] uppercase text-amber-400 font-semibold flex items-center justify-center space-x-1">
            <Flame size={11} />
            <span>Break</span>
          </div>
          <div className="text-lg font-black text-amber-400">{currentBreak}</div>
        </div>

        <div className="col-span-2 bg-neutral-900/90 border border-neutral-800 rounded-lg p-2 flex flex-col justify-center items-center shadow-inner">
          <div className="text-[10px] uppercase text-neutral-400 font-semibold">Ball On</div>
          <div className={`mt-0.5 text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center space-x-1.5 ${badge.bg}`}>
            <span className={`w-2 h-2 rounded-full shadow ${badge.dot}`} />
            <span>{badge.label}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[450px] flex items-center justify-between px-3 py-1.5 text-xs text-neutral-400 bg-neutral-900/60 rounded-lg border border-neutral-800/80 mb-2 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-neutral-300">Cue Lives:</span>
          <div className="flex items-center space-x-1.5">
            {[...Array(3)].map((_, i) => (
              <span 
                key={i} 
                className={`w-3 h-3 rounded-full transition-all duration-300 flex items-center justify-center text-[10px] ${
                  i < lives 
                    ? 'bg-white text-black shadow-[0_0_8px_#ffffff]' 
                    : 'bg-neutral-800 border border-neutral-700 text-transparent'
                }`}
              >
                ⚪
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] font-semibold text-neutral-300">Reds Left:</span>
          <span className="text-rose-400 font-mono font-bold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/40">
            {redsLeft} / 10
          </span>
        </div>
      </div>

      <div className="relative w-full max-w-[450px] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl border-2 border-neutral-800 bg-black touch-none">
        <canvas
          ref={canvasRef}
          width={V_WIDTH}
          height={V_HEIGHT}
          className="w-full h-full block cursor-crosshair"
        />

        {foulBanner && (
          <div className="absolute top-16 left-3 right-3 bg-rose-950/95 border-2 border-rose-500 text-rose-200 px-3 py-2.5 rounded-xl text-center text-xs font-bold shadow-2xl backdrop-blur-md animate-bounce flex items-center justify-center space-x-2 z-20">
            <ShieldAlert size={18} className="text-rose-400 shrink-0" />
            <div>
              <span>{foulBanner.text}</span>
              <span className="block text-[10px] text-rose-300 font-normal">
                Penalty: -{foulBanner.penalty} pts | 1 Life Lost
              </span>
            </div>
          </div>
        )}

        {(gameState === 'GAMEOVER' || gameState === 'VICTORY') && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
              <Trophy size={28} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">
              {gameState === 'VICTORY' ? 'Table Cleared!' : 'Out of Lives'}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {gameState === 'VICTORY' ? 'Full snooker clearance executed.' : 'Lost all 3 cue lives to scratches or fouls.'}
            </p>
            {isNewBest && (
              <span className="mt-2 inline-block text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/40 px-2.5 py-1 rounded-full">
                🏆 New Personal Best!
              </span>
            )}

            <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-lg p-3 my-4 grid grid-cols-3 gap-3 text-left">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Score</span>
                <span className="text-xl font-bold text-white">{score}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Best Break</span>
                <span className="text-xl font-bold text-amber-400">{highestBreak}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-semibold">All-Time Best</span>
                <span className="text-xl font-bold text-emerald-400">{personalBest}</span>
              </div>
              <div className="col-span-3 pt-1 border-t border-neutral-800">
                <span className="text-[10px] text-neutral-500 block uppercase font-semibold mb-1">Pot Sequence</span>
                <div className="text-sm font-mono tracking-widest text-neutral-200 break-all">
                  {historyPots.length > 0 ? historyPots.join(' ') : 'None'}
                </div>
              </div>
            </div>

            <div className="flex w-full space-x-2">
              <button
                onClick={handleCopyScore}
                className="flex-1 py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors border border-neutral-700"
              >
                <Share2 size={14} />
                <span>{copiedToast ? 'Copied!' : 'Share Score'}</span>
              </button>
              <button
                onClick={restartGame}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-emerald-600/30"
              >
                <RotateCcw size={14} />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {(gameState === 'BREAK_AIM' || gameState === 'BALL_IN_HAND') && (
        <div className="w-full max-w-[450px] mt-2.5 bg-neutral-900/95 border border-neutral-800 rounded-xl p-3 shadow-2xl flex flex-col space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {gameState === 'BREAK_AIM' ? 'Break Shot Setup' : 'Ball In Hand'}
              </span>
            </div>
            <div className="flex items-center space-x-1 bg-black/50 px-2 py-0.5 rounded border border-neutral-800 font-mono text-xs text-amber-400">
              <span>Aim Angle:</span>
              <span className="font-bold">{aimOffsetDeg > 0 ? `+${aimOffsetDeg}°` : `${aimOffsetDeg}°`}</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            <button
              type="button"
              onClick={() => updateAimAngle(aimOffsetDeg - 5)}
              className="py-1.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 rounded text-xs font-semibold flex items-center justify-center transition-all border border-neutral-700"
              title="-5 Degrees"
            >
              <Minus size={13} />
            </button>
            <button
              type="button"
              onClick={() => updateAimAngle(-25)}
              className={`py-1.5 rounded text-xs font-semibold transition-all border ${
                aimOffsetDeg === -25 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500' 
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border-neutral-700'
              }`}
            >
              Left -25°
            </button>
            <button
              type="button"
              onClick={() => updateAimAngle(0)}
              className={`py-1.5 rounded text-xs font-semibold transition-all border ${
                aimOffsetDeg === 0 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500' 
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border-neutral-700'
              }`}
            >
              Center 0°
            </button>
            <button
              type="button"
              onClick={() => updateAimAngle(25)}
              className={`py-1.5 rounded text-xs font-semibold transition-all border ${
                aimOffsetDeg === 25 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500' 
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border-neutral-700'
              }`}
            >
              Right +25°
            </button>
            <button
              type="button"
              onClick={() => updateAimAngle(aimOffsetDeg + 5)}
              className="py-1.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 rounded text-xs font-semibold flex items-center justify-center transition-all border border-neutral-700"
              title="+5 Degrees"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-neutral-400">
              <span className="flex items-center"><ChevronLeft size={12} /> Left Cut</span>
              <span>Slide to fine-tune trajectory</span>
              <span className="flex items-center">Right Cut <ChevronRight size={12} /></span>
            </div>
            <input 
              type="range"
              min="-50"
              max="50"
              step="1"
              value={aimOffsetDeg}
              onChange={(e) => updateAimAngle(Number(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <button
            type="button"
            onClick={fireShot}
            onTouchEnd={(e) => { e.preventDefault(); fireShot(); }}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black text-sm tracking-wide rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-transform active:scale-98"
          >
            <Zap size={18} className="fill-neutral-950" />
            <span>{gameState === 'BREAK_AIM' ? 'STRIKE BREAK SHOT' : 'STRIKE CUE BALL'}</span>
            <span className="text-[10px] bg-neutral-950/20 px-2 py-0.5 rounded text-neutral-900 font-bold ml-1">
              SPACEBAR
            </span>
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="w-full max-w-[450px] flex items-center justify-between mt-2 px-1 text-[11px] text-neutral-400">
          <span>Drag paddle along baulk line to steer cue ball</span>
          <span className="text-neutral-500">Outer edges cut steep angles</span>
        </div>
      )}

      {showRulesModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          style={{
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))'
          }}
        >
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-2xl relative">
            <button 
              onClick={() => setShowRulesModal(false)}
              className="absolute top-3 right-3 p-1.5 text-neutral-400 hover:text-white rounded-md"
            >
              <X size={18} />
            </button>
            <div className="flex items-center space-x-2 mb-3">
              <Info className="text-emerald-400" size={20} />
              <h3 className="font-bold text-base text-white">How to Play Snookong</h3>
            </div>
            
            <ul className="text-xs text-neutral-300 space-y-2.5 list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-amber-400">Break Shot Rule:</strong> On the break, your cue ball <em>must make first contact with a Red</em>. Hitting any Color first results in an immediate Foul / Scratch (-4 pts or color value) and costs 1 life.
              </li>
              <li>
                <strong className="text-white">Ball in Hand:</strong> When you foul or scratch, the cue ball docks safely on the paddle. Position the paddle and use the lower Control Pod to aim and fire.
              </li>
              <li>
                <strong className="text-rose-400">Red → Color Sequence:</strong> Pot a <strong>Red (1 pt)</strong>, then <strong>Any Color (2–7 pts)</strong>. Colors respot automatically as long as reds remain on the table.
              </li>
              <li>
                <strong className="text-emerald-400">Endgame Clearance:</strong> Once all 10 reds are potted, clear the colors in sequence: Yellow → Green → Brown → Blue → Pink → Black.
              </li>
              <li>
                <strong className="text-amber-400">Paddle Spin:</strong> Hitting the cue ball with the outer edges of the paddle cuts sharp spin angles across the baize.
              </li>
            </ul>

            <button
              onClick={() => setShowRulesModal(false)}
              className="mt-5 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Back to Table
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
