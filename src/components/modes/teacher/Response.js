import React, { Component } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ConfirmDialog from '../../common/ConfirmDialog';
import {
  deleteAppInstanceResource,
  patchAppInstanceResource,
} from '../../../actions';

class Response extends Component {
  state = {
    confirmDialogOpen: false,
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchDeleteAppInstanceResource: PropTypes.func.isRequired,
    _id: PropTypes.string.isRequired,
    data: PropTypes.string,
    student: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    data: '',
  };

  handleToggleConfirmDialog = open => () => {
    this.setState({
      confirmDialogOpen: open,
    });
  };

  handleConfirmDelete = () => {
    const { _id, dispatchDeleteAppInstanceResource } = this.props;
    dispatchDeleteAppInstanceResource(_id);
    this.handleToggleConfirmDialog(false)();
  };

  render() {
    const { t, _id, data, student } = this.props;

    const { confirmDialogOpen } = this.state;

    return (
      <TableRow key={_id}>
        <TableCell>{student.name}</TableCell>
        <TableCell>{data}</TableCell>
        <TableCell>
          <TextField
            key="inputTextField"
            id="inputTextField"
            multiline
            rowsMax="5"
            onChange={this.handleChangeFeedback}
            margin="normal"
            fullWidth
          />
        </TableCell>
        <TableCell>
          <IconButton
            color="primary"
            onClick={this.handleToggleConfirmDialog(true)}
          >
            <DeleteIcon />
          </IconButton>
          <ConfirmDialog
            open={confirmDialogOpen}
            title={t('Delete Student Response')}
            text={t(
              'By clicking "Delete", you will be deleting the student\'s response. This action cannot be undone.'
            )}
            handleClose={this.handleToggleConfirmDialog(false)}
            handleConfirm={this.handleConfirmDelete}
            confirmText={t('Delete')}
            cancelText={t('Cancel')}
          />
        </TableCell>
      </TableRow>
    );
  }
}

// allow this component to dispatch a post
// request to create an app instance resource
const mapDispatchToProps = {
  dispatchPatchAppInstanceResource: patchAppInstanceResource,
  dispatchDeleteAppInstanceResource: deleteAppInstanceResource,
};

const ConnectedComponent = connect(
  null,
  mapDispatchToProps
)(Response);

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default TranslatedComponent;
