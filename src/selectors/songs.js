import { orm } from 'store/orm';
import { get } from 'lodash';
import { createSelector as ormCreateSelector } from 'redux-orm';
import { createSelector } from 'reselect';

export const ormSelector = state => state.orm;

const lastNameSelector = ormCreateSelector(orm, session => {
  const artists = session.Artist ? session.Artist.all().toModelArray() : [];
  return artists.map(artist => {
    return { label: artist.lastName, value: artist.lastName} ;
  });
});

const artistMatchSelector = ormCreateSelector(orm, (session, artist) => {
  if (artist) {
    return session.Artist.findByFullName(artist.lastName + ', ' + artist.firstName);
  }
  return null;
});

const genreSelector = ormCreateSelector(orm, session => {
  const genres = session.Genre ? session.Genre.all().toModelArray() : [];
  return genres.map(genre => {
    return { label: genre.name, value: genre.id };
  });
});

const instrumentSelector = ormCreateSelector(orm, session => {
  const instruments = session.Instrument ? session.Instrument.all().toModelArray() : [];
  return instruments.map(instrument => {
    return { label: instrument.name, value: instrument.id };
  });
});

export const artistLastNames = createSelector(ormSelector, state => state, lastNameSelector);

export const artistsMatched = createSelector(
  ormSelector,
  state => get(state, 'form.addSongForm.values.artist', null),
  artistMatchSelector
);

export const genres = createSelector(ormSelector, state => state, genreSelector);
export const instruments = createSelector(ormSelector, state => state, instrumentSelector);
