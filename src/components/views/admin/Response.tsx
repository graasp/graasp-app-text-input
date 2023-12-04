import { useEffect, useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../common/ConfirmDialog';
import FormDialog from '../../common/FormDialog';
import { showErrorToast } from '../../../utils/toasts';
import { ACTION_TYPES } from '../../../config/actionTypes';
import { mutations } from '../../../config/queryClient';
import {
  deleteButtonCypress,
  deleteConfirmButtonCypress,
  editFeedbackButtonCypress,
  feedbackCellCypress,
  feedbackTextCypress,
  responseCellCypress,
  studentResponseId,
} from '../../../config/selectors';
import { AppData, Member, UUID, formatDate } from '@graasp/sdk';
import { useTableSettingsContext } from '@/context/TableSettingsContext';
import isEmpty from 'lodash.isempty';

type Props = {
  id: UUID;
  data?: string;
  updatedAt: string;
  student?: Member | null;
  feedbackResource?: AppData;
};

const Response = ({
  id,
  data,
  updatedAt,
  student,
  feedbackResource,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { settings } = useTableSettingsContext();
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();

  useEffect(() => {
    if (feedbackResource) {
      // todo: use app data with generic type
      setFeedbackText(feedbackResource.data.text as string);
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
    if (feedbackResource && !isEmpty(feedbackResource)) {
      deleteAppData({ id: feedbackResource.id });
    }
    handleToggleConfirmDialog();
  };

  const handleSubmitFeedback = (text: string) => {
    if (!student?.id) {
      showErrorToast(
        'Currently we do not support giving feedback to anonymous users.'
      );
    } else {
      // if no feedback resource yet, create it, otherwise, update it
      if (!feedbackResource || isEmpty(feedbackResource)) {
        postAppData({
          memberId: student.id,
          data: { text, memberId: student.id },
          type: ACTION_TYPES.FEEDBACK,
        });
      } else {
        patchAppData({
          id: feedbackResource.id,
          data: { text, memberId: student.id },
        });
      }
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
    <TableRow key={id} data-cy={studentResponseId(student?.id ?? 'none')}>
      <TableCell>{student?.name ?? t('Anonymous')}</TableCell>
      <TableCell data-cy={responseCellCypress}>{data}</TableCell>
      <TableCell>
        {settings.useRelativeTime
          ? formatDate(updatedAt, { locale: i18n.language })
          : updatedAt}
      </TableCell>
      <TableCell data-cy={feedbackCellCypress}>
        {renderFeedbackCell()}
      </TableCell>
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

export default Response;
