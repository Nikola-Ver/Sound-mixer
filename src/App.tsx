/// <reference path="../node_modules/chrome-extension-async/chrome-extension-async.d.ts" />
import React from 'react';
import { ITabs } from './interfaces';
import SlidersGroup from './components/slidersGroup/slidersGroup';
import { Message } from './interfaces';
import 'chrome-extension-async';
import './App.scss';

function App() {
  const [tabs, setTabs] = React.useState<ITabs>([]);

  async function getTabVolume(tabId: number) {
    const message: Message = { name: 'get-tab-volume', tabId };
    return chrome.runtime?.sendMessage(message);
  }

  async function setTabVolume(tabId: number, value: number) {
    const message: Message = { name: 'set-tab-volume', tabId, value };
    return chrome.runtime?.sendMessage(message);
  }

  React.useEffect(() => {
    void (async () => {
      const allTabs = await chrome.tabs?.query({});
      if (allTabs === undefined) return;
      let tabsTemp: ITabs = [];

      for (let i = 0; i < allTabs.length; ++i) {
        const element = allTabs[i];
        const siteName = element.url!.split('/')[2];
        const tabName = element.title!;
        const volValue = (await getTabVolume(element.id!)) * 100;

        const index = tabsTemp.findIndex((e) => e.name === siteName);

        if (index !== -1) {
          tabsTemp[index].tabs.push({
            tabName,
            volValue,
            setVolCallback: (value) => {
              setTabVolume(element.id!, value);
            },
          });
        } else {
          tabsTemp.push({
            name: siteName,
            tabs: [
              {
                tabName,
                volValue,
                setVolCallback: (value) => {
                  setTabVolume(element.id!, value);
                },
              },
            ],
          });
        }
      }

      setTabs(tabsTemp);
    })();
  }, []);

  return (
    <>
      {tabs.map((element, index) => (
        <SlidersGroup name={element.name} tabs={element.tabs} key={index} />
      ))}
    </>
  );
}

export default App;
