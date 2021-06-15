import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeMute from '@material-ui/icons/VolumeMute';
import Tooltip from '@material-ui/core/Tooltip';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { IInputSliderProps } from '../../interfaces';
import './inputSlider.scss';

const muiTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      thumb: {
        color: '#00ffa1',
      },
      track: {
        color: '#00ffa1',
      },
      rail: {
        color: '#00794d',
      },
    },
    MuiInputBase: {
      input: {
        color: '#fff',
      },
    },
  },
});

export default function InputSlider(props: IInputSliderProps) {
  const [value, setValue] = React.useState<
    number | string | Array<number | string>
  >(props.volValue ?? 100);

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    props.setVolCallback((newValue as number) / 100);
    setValue(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <div className='root-slider'>
      <Tooltip title={props.tabName}>
        <Typography className='text-slider'>{props.tabName}</Typography>
      </Tooltip>
      <Grid container spacing={2} alignItems='center'>
        <Grid item>
          {value > 50 ? (
            <VolumeUp />
          ) : value > 0 ? (
            <VolumeDown />
          ) : (
            <VolumeMute />
          )}
        </Grid>
        <ThemeProvider theme={muiTheme}>
          <Grid item xs>
            <Slider
              value={typeof value === 'number' ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby='input-slider'
            />
          </Grid>
          <Grid item>
            <Input
              className='input-slider'
              value={value}
              margin='dense'
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 10,
                min: 0,
                max: 100,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        </ThemeProvider>
      </Grid>
    </div>
  );
}
