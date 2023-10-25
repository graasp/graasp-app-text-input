import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

const ConfirmDialog = (props) => {
  const {
    open,
    handleClose,
    handleConfirm,
    title,
    text,
    confirmText,
    cancelText,
    confirmButtonCypress,
  } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {cancelText}
          </Button>
          <Button
            color="error"
            data-cy={confirmButtonCypress}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmButtonCypress: PropTypes.string.isRequired,
};

ConfirmDialog.defaultProps = {
  text: '',
  confirmText: 'OK',
  cancelText: 'Cancel',
};

export default ConfirmDialog;
