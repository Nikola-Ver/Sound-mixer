import React from 'react';
import InputSlider from '../inputSlider/inputSlider';
import { ISlidersGroupProps } from '../../interfaces';
import './slidersGroup.scss';

export default function SlidersGroup(props: ISlidersGroupProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <div className={`sliders-group${isOpen ? ' open' : ''}`}>
      <div
        className='header'
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className='button'></div>
        <div className='text'>{props.name}</div>
      </div>
      <div
        className='content'
        style={{ height: isOpen ? `${props.tabs.length * 60}px` : '0px' }}
      >
        {props.tabs.map((element, index) => (
          <InputSlider
            tabName={element.tabName}
            volValue={element.volValue}
            setVolCallback={element.setVolCallback}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}
