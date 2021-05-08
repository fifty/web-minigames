import { DRAW_IT_CANVAS_ID, DRAW_IT_CONTAINER_ID, Tools } from './constants';
import { renderGame } from './game-renderer';
import { BrushRenderer } from './renderers/brush-renderer';
import { State } from './index';

let gameManagerInstance: GameManager | null = null;

export function mountGame(state: State) {
  gameManagerInstance = new GameManager(state);
  gameManagerInstance.start();
}

export function unMountGame() {
  gameManagerInstance?.stop();
  gameManagerInstance = null;
}

export class GameManager {
  private canvas: HTMLCanvasElement | null = null;
  private canvasWrapper: HTMLDivElement | null = null;

  public mousePos: { x: number; y: number } | null = null;

  public state: State;

  constructor(state: State) {
    this.draw = this.draw.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.updateCanvasSize = this.updateCanvasSize.bind(this);
    this.mousePos;

    this.state = state;
  }

  public start() {
    this.canvas = document.getElementById(DRAW_IT_CANVAS_ID) as HTMLCanvasElement;
    this.canvasWrapper = document.getElementById(DRAW_IT_CONTAINER_ID) as HTMLDivElement;

    this.canvas.width = this.canvasWrapper.offsetWidth;
    this.canvas.height = this.canvasWrapper.offsetHeight;

    this.canvas.addEventListener('mousedown', e => this.setMousePosition(e));
    this.canvas.addEventListener('mouseenter', e => this.setMousePosition(e));
    this.canvas.addEventListener('mousemove', e => this.drawLine(e));

    this.canvas && this.draw();
  }

  public stop() {
    window.removeEventListener('resize', this.updateCanvasSize);
    window.removeEventListener('mousedown', e => this.setMousePosition(e));
    window.removeEventListener('mouseenter', e => this.setMousePosition(e));
    window.removeEventListener('mousemove', e => this.drawLine(e));
  }

  public updateCanvasSize() {
    if (!this.canvas) return;

    this.canvas.width = this.canvasWrapper.clientWidth;
    this.canvas.height = this.canvasWrapper.clientHeight;
  }

  public draw() {
    renderGame(this);
  }

  public getCanvas() {
    return this.canvas;
  }

  public getCanvasContext() {
    return this.canvas?.getContext('2d');
  }

  public setMousePosition(e: MouseEvent) {
    this.mousePos = { x: e.clientX, y: e.clientY };
  }

  public getCanvasSize() {
    return {
      width: this.canvas?.width ?? 0,
      height: this.canvas?.height ?? 0,
    };
  }

  public static getGameManager(): GameManager | null {
    return gameManagerInstance;
  }

  public drawLine(e: MouseEvent) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    switch (this.state.activeTool) {
      case Tools.PAINT_BRUSH:
      case Tools.RUBBER:
        BrushRenderer(this.getCanvasContext(), e);
    }
  }

  public setState(state: State) {
    this.state = state;
  }
}
