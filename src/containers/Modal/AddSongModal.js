import { connect } from 'react-redux';
import AddSongModal from 'components/Modal/AddSongModal';

export const hideModal = () => {
  return (dispatch, getState) => {
    return dispatch({ type: "HIDE_MODAL" });
  };
}

export const addSong = () => {
  debugger;
};

export const isOpen = (modal) => {
  return (modal.modalType === 'ADD_SONG');
};

const mapDispatchToProps = {
  hideModal,
  addSong
};

const mapStateToProps = (state) => ({
  modal: state.modal,
  isOpen: isOpen(state.modal)
});

export default connect(mapStateToProps, mapDispatchToProps)(AddSongModal);
