export interface IInputSliderProps {
  tabName: string;
  volValue?: number;
  setVolCallback(volValue: number): void;
}

export interface ISlidersGroupProps {
  name: string;
  tabs: Array<IInputSliderProps>;
}

export type ITabs = Array<ISlidersGroupProps>;

export interface CapturedTab {
  audioContext: AudioContext;
  streamSource: MediaStreamAudioSourceNode;
  gainNode: GainNode;
}

export type Message =
  | {
      name: 'get-tab-volume';
      tabId: number;
    }
  | {
      name: 'set-tab-volume';
      tabId: number;
      value: number;
    };
