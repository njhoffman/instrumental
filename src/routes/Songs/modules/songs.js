import {
  songs as songsSelector,
  artists as artistsSelector ,
  currentSong as currentSongSelector
} from 'routes/Songs/modules/selectors';


import { CALL_API, Schemas } from 'middleware/api';

export const INIT_SONG_VIEW   = 'INIT_SONG_VIEW';
export const SET_CURRENT_SONG = 'SET_CURRENT_SONG';
export const HIDE_MODAL       = 'HIDE_MODAL';
export const SET_SORT = 'SET_SORT';
export const FETCH_SONGS = 'FETCH_SONGS';


// ------------------------------------
// Action Creators
// ------------------------------------

export const hideModal = () => {
  return (dispatch, getState) => {
    return dispatch({ type: HIDE_MODAL });
  };
}

export const setCurrentSong = (rowNumber, columnNumber, e) => (dispatch, getState) => {
  // use onCellClick to access event handler to grab correct song id
  // TODO: make pull request for onRowSelect to return custom id instead of autogenerated rowNumber
  const currentSong = e.currentTarget.attributes['data-rowid'].value;
  return dispatch({ type: SET_CURRENT_SONG, payload: currentSong });
};

export const setSort = (sortField) => (dispatch, getState) => {
  return dispatch({ type: SET_SORT, payload: sortField });
};


const nextAvailableId = (songCollection) =>
  songCollection
    .map( (song) => song.id )
    .sort( (a, b) => a - b )
    .pop() + 1;

export const addSong = (values) => (dispatch, getState) => {
  const fieldValues = getState().form.addSongForm.values;
  const availableId = nextAvailableId(getState().songs.collection);
  return dispatch({ type: 'ADD_SONG', payload: { ...fieldValues, ...{ id: availableId }} });
};

export const songsSuccess = (response) => {
  return dispatch => {
    const tables = response.tables;
    dispatch({ type: SONGS_SUCCESS,      payload: response });
    dispatch({ type: 'LOAD_ARTISTS',     payload: tables.artists });
    dispatch({ type: 'LOAD_INSTRUMENTS', payload: tables.instruments });
    dispatch({ type: 'LOAD_GENRES',      payload: tables.genres });
    dispatch({ type: 'LOAD_SONGS',       payload: tables.songs });
  }
};

export const SONGS_REQUEST = 'SONGS_REQUEST';
export const SONGS_SUCCESS = 'SONGS_SUCCESS';
export const SONGS_FAILURE = 'SONGS_FAILURE';

// Fetches a page of starred repos by a particular user.
export const fetchSongs = () =>  {
  const nextPageUrl = `/songs`;
  return dispatch => {
    return dispatch({
      [CALL_API]: {
        types: [ SONGS_REQUEST, songsSuccess, SONGS_FAILURE ],
        endpoint: nextPageUrl
      }
    });
  }
}


export const actions = {
  addSong, hideModal, setCurrentSong, fetchSongs
};


// ------------------------------------
// Property Mappers
// ------------------------------------

export const isOpen = (modal) => {
  return (modal.modalType === 'ADD_SONG');
};

export const getCurrentSong = (state) => {
  return currentSongSelector(state);
};

export const getVisibleSongs = (state) => {
  return songsSelector(state);
};

// ------------------------------------
// Action Handlers
// ------------------------------------

import { Song, Artist, Instrument, Genre } from './model';
const songsSuccess2 = (state, action) => {

  // load dependent tables first
  const sng = Song;
  const art = Artist;
  const tables = action.response.tables;
  tables.artists.forEach(artist => {
    Artist.create(artist);
  });
  tables.genres.forEach(genre => {
    Genre.create(genre);
  });
  tables.instruments.forEach(instrument => {
    Instrument.create(instrument);
  });
  tables.songs.forEach(song => {
    Song.create(song);
  });
  debugger;
  return state;
};

const ACTION_HANDLERS = {
  [INIT_SONG_VIEW]: (state, action) => {
    return ({ ...state, initialized: true });
  },
  [SET_CURRENT_SONG]: (state, action) =>
    ({ ...state, currentSong: action.payload }),
  [SONGS_REQUEST]: (state, action) =>
    ({ ...state, fetching: true }),
  [SONGS_SUCCESS]: (state, action) =>
    ({ ...state, fetching: false}),
  [SET_SORT]: (state, action) =>
    ({ ...state, sortField: action.payload })

};


// ------------------------------------
// Reducer
// ------------------------------------


const initialState = {
  fetching:           false,
  currentGenres:      [],
  currentInstruments: [],
  initialized:        false,
  currentFilters:     [],
  sortField:          ''
};

export default function songsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}

