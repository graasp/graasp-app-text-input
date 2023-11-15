import React, { Component } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import {
  feedbackInputCypress,
  submitButtonCypress,
} from '../../config/selectors';

class FormDialog extends Component {
  state = {
    input: '',
  };

  static propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    submitText: PropTypes.string,
    cancelText: PropTypes.string,
    initialInput: PropTypes.string,
  };

  static defaultProps = {
    text: '',
    submitText: 'Submit',
    cancelText: 'Cancel',
    initialInput: '',
  };

  componentDidMount() {
    const { initialInput } = this.props;
    if (initialInput !== '') {
      this.setState({
        input: initialInput,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { initialInput } = this.props;
    const { initialInput: prevInitialInput } = prevProps;
    const { input: prevInput } = prevState;

    // only update state if it is sure to not trigger a infinite render loop
    if (prevInitialInput !== initialInput && prevInput !== initialInput) {
      this.setState({ input: initialInput });
    }
  }

  handleChangeTextField = (event) => {
    this.setState({
      input: event.target.value,
    });
  };

  render() {
    const {
      open,
      handleClose,
      handleSubmit,
      title,
      text,
      submitText,
      cancelText,
    } = this.props;

    const { input } = this.state;

    return (
      <div>
        <Dialog
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
              value={input}
              maxRows="5"
              onChange={this.handleChangeTextField}
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
  }
}

export default FormDialog;
