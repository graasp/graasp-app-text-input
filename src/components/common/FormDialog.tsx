import { ChangeEventHandler, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  feedbackInputCypress,
  submitButtonCypress,
} from '../../config/selectors';

type FormDialogProps = {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (input: string) => void;
  title: string;
  text?: string;
  submitText?: string;
  cancelText?: string;
  initialInput?: string;
};

const FormDialog = ({
  open,
  handleClose,
  handleSubmit,
  title,
  text = '',
  submitText = 'Submit',
  cancelText = 'Cancel',
  initialInput = '',
}: FormDialogProps) => {
  const [input, setInput] = useState(initialInput);

  useEffect(() => {
    setInput(initialInput);
  }, [initialInput]);

  const handleChangeTextField: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setInput(event.target.value);
  };

  return (
    <div>
      <Dialog
        disableRestoreFocus
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
          <TextField
            data-cy={feedbackInputCypress}
            multiline
            autoFocus
            value={input}
            maxRows="5"
            onChange={handleChangeTextField}
            margin="dense"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {cancelText}
          </Button>
          <Button
            data-cy={submitButtonCypress}
            onClick={() => handleSubmit(input)}
            color="primary"
          >
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FormDialog;
