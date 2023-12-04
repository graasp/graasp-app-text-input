import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmDialog = ({
  open,
  handleClose,
  handleConfirm,
  title,
  text = '',
  confirmText = 'OK',
  cancelText = 'Cancel',
  confirmButtonCypress,
}: ConfirmDialogProps) => {
  return (
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
  );
};

type ConfirmDialogProps = {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonCypress: string;
};

export default ConfirmDialog;
