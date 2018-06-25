import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ComponentLayout from 'utils/dev/ComponentLayout';
import buttonGroups from './ButtonIcons.props.js';
import Button from 'components/Button';

const titleStyle = {
  width: '100%',
  textAlign: 'center',
  opacity: 0.8,
  marginTop: '10px'
};

export default {
  namespace: 'Buttons',
  name: 'Icons',
  component: ComponentLayout,
  children: buttonGroups.map(buttonGroup => (
    <Grid item>
      <Typography variant='body2' style={titleStyle}>
        {buttonGroup.title}
      </Typography>
      <Grid container spacing={16} justify="center">
        {buttonGroup.props.map((propGroup, i) => (
          <Grid item key={i}>
            <Button {...propGroup} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  ))
};