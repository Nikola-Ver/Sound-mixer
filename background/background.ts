/// <reference path="../node_modules/chrome-extension-async/chrome-extension-async.d.ts" />
import 'chrome-extension-async';

type Message =
  | {
      name: 'get-tab-volume';
      tabId: number;
    }
  | {
      name: 'set-tab-volume';
      tabId: number;
      value: number;
    };

chrome.runtime.onMessage.addListener(
  async (message: Message, sender, respond) => {
    switch (message.name) {
      case 'get-tab-volume':
        respond(await getTabVolume(message.tabId));
        break;
      case 'set-tab-volume':
        respond(undefined);
        await setTabVolume(message.tabId, message.value);
        break;
    }
  }
);

chrome.tabs.onRemoved.addListener(disposeTab);

interface CapturedTab {
  audioContext: AudioContext;
  streamSource: MediaStreamAudioSourceNode;
  gainNode: GainNode;
}

const tabs: { [tabId: number]: Promise<CapturedTab> } = {};

function captureTab(tabId: number) {
  tabs[tabId] = new Promise(async (resolve) => {
    const stream = await chrome.tabCapture.capture({
      audio: true,
      video: false,
    });

    const audioContext = new AudioContext();
    const streamSource = audioContext.createMediaStreamSource(stream);
    const gainNode = audioContext.createGain();

    streamSource.connect(gainNode);
    gainNode.connect(audioContext.destination);

    resolve({ audioContext, streamSource, gainNode });
  });
}

async function getTabVolume(tabId: number) {
  return tabId in tabs ? (await tabs[tabId]).gainNode.gain.value : 1;
}

async function setTabVolume(tabId: number, value: number) {
  if (!(tabId in tabs)) {
    const [{ id }] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (id !== tabId) {
      await chrome.tabs.update(tabId, { highlighted: true });
      return;
    }

    captureTab(tabId);
  }

  (await tabs[tabId]).gainNode.gain.value = value;
}

async function disposeTab(tabId: number) {
  if (tabId in tabs) {
    (await tabs[tabId]).audioContext.close();
    delete tabs[tabId];
  }
}
