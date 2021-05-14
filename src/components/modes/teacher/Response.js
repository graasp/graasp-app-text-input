import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ConfirmDialog from '../../common/ConfirmDialog';
import FormDialog from '../../common/FormDialog';
import { showErrorToast } from '../../../utils/toasts';
import { ACTION_TYPES } from '../../../config/actionTypes';
import { MUTATION_KEYS, useMutation } from '../../../config/queryClient';
import {
  deleteButtonCypress,
  deleteConfirmButtonCypress,
  editFeedbackButtonCypress,
  feedbackTextCypress,
} from '../../../config/selectors';

const Response = ({ id, data, student, feedbackResource }) => {
  const { t } = useTranslation();
  const [feedbackText, setFeedbackText] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const { mutate: postAppData } = useMutation(MUTATION_KEYS.POST_APP_DATA);
  const { mutate: patchAppData } = useMutation(MUTATION_KEYS.PATCH_APP_DATA);
  const { mutate: deleteAppData } = useMutation(MUTATION_KEYS.DELETE_APP_DATA);

  useEffect(() => {
    if (feedbackResource) {
      setFeedbackText(feedbackResource?.data?.text);
    }
  }, [feedbackResource]);

  const handleToggleConfirmDialog = () => {
    setConfirmDialogOpen(!confirmDialogOpen);
  };

  const handleToggleFeedbackDialog = () => {
    setFeedbackDialogOpen(!feedbackDialogOpen);
  };

  const handleConfirmDelete = () => {
    deleteAppData({ id });
    if (!_.isEmpty(feedbackResource)) {
      deleteAppData({ id: feedbackResource.id });
    }
    handleToggleConfirmDialog();
  };

  const handleSubmitFeedback = (text) => {
    if (!student?.id) {
      showErrorToast(
        'Currently we do not support giving feedback to anonymous users.'
      );
    }

    // if no feedback resource yet, create it, otherwise, update it
    if (_.isEmpty(feedbackResource)) {
      postAppData({
        data: { text, memberId: student.id },
        type: ACTION_TYPES.FEEDBACK,
      });
    } else {
      patchAppData({
        id: feedbackResource.id,
        data: { text, memberId: student.id },
      });
    }
    handleToggleFeedbackDialog();
  };

  const renderFeedbackCell = () => {
    return (
      <span data-cy={feedbackTextCypress}>
        {feedbackText}
        <IconButton
          data-cy={editFeedbackButtonCypress}
          color="primary"
          onClick={handleToggleFeedbackDialog}
        >
          <EditIcon />
        </IconButton>
        <FormDialog
          handleClose={handleToggleFeedbackDialog}
          title={t('Feedback')}
          text={t('Submit feedback that will be visible to the student.')}
          open={feedbackDialogOpen}
          initialInput={feedbackText}
          handleSubmit={handleSubmitFeedback}
        />
      </span>
    );
  };

  return (
    <TableRow key={id}>
      <TableCell>{student.name}</TableCell>
      <TableCell>{data}</TableCell>
      <TableCell>{renderFeedbackCell()}</TableCell>
      <TableCell>
        <IconButton
          data-cy={deleteButtonCypress}
          color="primary"
          onClick={handleToggleConfirmDialog}
        >
          <DeleteIcon />
        </IconButton>
        <ConfirmDialog
          open={confirmDialogOpen}
          title={t('Delete Student Response')}
          text={t(
            'By clicking "Delete", you will be deleting the student\'s response. This action cannot be undone.'
          )}
          handleClose={handleToggleConfirmDialog}
          handleConfirm={handleConfirmDelete}
          confirmText={t('Delete')}
          cancelText={t('Cancel')}
          confirmButtonCypress={deleteConfirmButtonCypress}
        />
      </TableCell>
    </TableRow>
  );
};

Response.propTypes = {
  data: PropTypes.string,
  student: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  feedbackResource: PropTypes.shape({
    data: PropTypes.shape({
      text: PropTypes.string.isRequired,
      memberId: PropTypes.string.isRequired,
    }).isRequired,
  }),
  id: PropTypes.string.isRequired,
};

Response.defaultProps = {
  data: '',
  feedbackResource: {},
};

export default Response;
