import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles, Typography } from '@material-ui/core';
import FormField, { FormRow, Stars } from 'components/Field';
import { Row, Column } from 'react-foundation';
import PropTypes from 'prop-types';

import Button from 'components/Button';
import {
  genreMatch,
  instrumentMatch,
  artistMatch,
  artistLastNames,
  instruments,
  genres
} from 'selectors/songs';
import { maxDifficulty } from 'selectors/users';
import {
  FIELD_VARIANT_EDIT, FIELD_VARIANT_ADD, FIELD_VARIANT_VIEW,
  MODAL_VARIANT_EDIT, MODAL_VARIANT_ADD, MODAL_VARIANT_VIEW
} from 'constants/ui';
// import css from './AddSong.scss';

const styles = (theme) => ({
  imageFrame: {
    textAlign: 'center'
  },
  image: {
    height: '200px',
    marginBottom: '5px'
  },
  progressStars: theme.instrumental.starColor,
  row: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    flexWrap: 'wrap'
  }
});

export const SongMainTab = ({
  activeField,
  lastActiveField,
  matchedArtist,
  matchedGenre,
  matchedInstrument,
  lastNameOptions,
  instrumentOptions,
  genreOptions,
  maxDifficulty,
  classes,
  variant: modalVariant,
  ...props
}) => {
  const fieldProps = {
    ...props,
    fullWidth: true,
    variant:  (modalVariant === MODAL_VARIANT_EDIT ? FIELD_VARIANT_EDIT
      : modalVariant === MODAL_VARIANT_ADD ? FIELD_VARIANT_ADD : FIELD_VARIANT_VIEW)
  };

  const matchedImages = () => {
    const fieldRE = /^artist|^instrument|^genre/;
    const field = (
      activeField && fieldRE.test(activeField) ? activeField
      : lastActiveField && fieldRE.test(lastActiveField) ? lastActiveField
      : 'artist').replace(/\..*/, '');
    const matchers = { artist: matchedArtist, genre: matchedGenre, instrument: matchedInstrument };
    const matched = matchers[field];
    const buttonLabel =  matched.images && matched.images.length > 0 ? 'Change Picture' : 'Add Picture';
    return { buttonLabel, imageLabel: matched.imageLabel, image: matched.primaryImage };
  };

  const renderImage = () => {
    // TODO: Find a better way through config!
    const { buttonLabel, imageLabel, image } = matchedImages();

    return (
      <Column>
        <img className={classes.image} src={`${image}`} />
        <Typography>{imageLabel}</Typography>
        { modalVariant !== MODAL_VARIANT_EDIT && <Button variant='raised' secondary label={buttonLabel} /> }
      </Column>
    );
  };

  const renderStars = (number) => ( <Stars className={classes.progressStars} number={parseInt(number)} />);

  const renderViewFields = () => (
    <FormRow>
      <FormField
        name='title'
        type='text'
        label='Song Title'
        {...fieldProps}
      />
      <FormField
        name='artist.fullName'
        type='text'
        label='Song Artist'
        {...fieldProps}
      />
    </FormRow>
  );

  const renderEditFields = () => (
    <Fragment>
      <FormRow>
        <FormField
          name='title'
          type='text'
          small={12}
          medium={8}
          centerOnSmall
          label='Song Title'
          {...fieldProps}
        />
      </FormRow>
      <FormRow>
        <FormField
          name='artist.lastName'
          type='autocomplete'
          label='Last Name / Band'
          options={lastNameOptions}
          maxResults={10}
          {...fieldProps}
        />
        <FormField
          name='artist.firstName'
          type='text'
          label='First Name'
          {...fieldProps}
        />
      </FormRow>
    </Fragment>
  );

  return (
    <Fragment>
      <FormRow>
        <Column>
          <Row className={classes.imageFrame}>
            { renderImage() }
          </Row>
        </Column>
      </FormRow>
      {modalVariant === MODAL_VARIANT_VIEW && renderViewFields()}
      {modalVariant !== MODAL_VARIANT_VIEW && renderEditFields()}
      <FormRow>
        <FormField
          name='genre.displayName'
          type='autocomplete'
          label='Song Genre'
          options={genreOptions}
          maxResults={2}
          {...fieldProps}
        />
        <FormField
          name='instrument.displayName'
          type='autocomplete'
          label='Instrument'
          options={instrumentOptions}
          maxResults={10}
          {...fieldProps}
        />
      </FormRow>
      <FormRow>
        <FormField
          name='difficulty'
          type='slider'
          label='Difficulty'
          min={1}
          max={maxDifficulty}
          step={1}
          {...fieldProps}
        />
        <FormField
          name='progress'
          type='slider'
          label='Progress'
          min={0}
          max={4}
          step={1}
          valueDisplay={renderStars}
          {...fieldProps}
        />
      </FormRow>
    </Fragment>
  );
};

SongMainTab.propTypes = {
  lastActiveField:   PropTypes.string.isRequired,
  activeField:       PropTypes.string.isRequired,
  matchedArtist:     PropTypes.object,
  lastNameOptions:   PropTypes.any.isRequired,
  genreOptions:      PropTypes.any.isRequired,
  instrumentOptions: PropTypes.any.isRequired,
  maxDifficulty:     PropTypes.number,
  classes:           PropTypes.object.isRequired,
  variant:           PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  matchedGenre:      genreMatch(state),
  matchedInstrument: instrumentMatch(state),
  matchedArtist:     artistMatch(state),
  maxDifficulty:     maxDifficulty(state),
  lastNameOptions:   artistLastNames(state),
  genreOptions:      genres(state),
  instrumentOptions: instruments(state)
});

export default connect(mapStateToProps)(withStyles(styles)(SongMainTab));