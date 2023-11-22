import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Alert, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Response from './Response';
import { RESPONSES_COLUMNS } from '../../../config/settings';
import {
  responsesTableCypress,
  tableNoResponsesCypress,
} from '../../../config/selectors';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import { hooks } from '@/config/queryClient';
import Loader from '@/components/common/Loader';
import { TableSettingsContextProvider } from '@/context/TableSettingsContext';
import TableSwitchSetting from '@/components/common/TableSwitchSetting';

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
  overflowX: 'auto',
}));

const StyledTable = styled(Table)({
  minWidth: 700,
});

const TableContent = () => {
  const { data: context } = hooks.useAppContext();
  const { t } = useTranslation();
  const { data: appData, isLoading: isAppDataLoading } = hooks.useAppData();

  if (appData) {
    const nonEmptyData = appData.filter(({ data }) => Boolean(data?.text));

    // if there are no resources, show an empty table
    if (!nonEmptyData.length) {
      return (
        <TableRow data-cy={tableNoResponsesCypress}>
          <TableCell align="center" colSpan={4}>
            {t('No Responses')}
          </TableCell>
        </TableRow>
      );
    }

    const responses = nonEmptyData.filter(
      ({ type }) => type === APP_DATA_TYPES.INPUT
    );
    const feedbacks = nonEmptyData.filter(
      ({ type }) => type === APP_DATA_TYPES.FEEDBACK
    );
    // map each app instance resource to a row in the table
    return responses.map(({ id, member, data, updatedAt }) => {
      const m = context?.members.find((m) => m.id === member.id);
      const feedbackResource = m
        ? feedbacks.find(({ data: { memberId: mId } }) => mId === m.id)
        : undefined;
      return (
        <Response
          id={id}
          key={id}
          student={m}
          updatedAt={updatedAt}
          data={data?.text as string}
          feedbackResource={feedbackResource}
        />
      );
    });
  }
  if (isAppDataLoading) {
    return <Loader />;
  }

  return <Alert severity="error">Something went wrong</Alert>;
};

const Responses = () => {
  const { t } = useTranslation();

  return (
    <div>
      <TableSettingsContextProvider>
        <Typography variant="h6" color="inherit">
          {t('These are the responses submitted by the students.')}
        </Typography>
        <TableSwitchSetting
          label={t('Use relative time')}
          settingKey="useRelativeTime"
        />
        <StyledPaper>
          <StyledTable data-cy={responsesTableCypress}>
            <TableHead>
              <TableRow>
                {RESPONSES_COLUMNS.map((column) => (
                  <TableCell key={column}>{t(column)}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableContent />
            </TableBody>
          </StyledTable>
        </StyledPaper>
      </TableSettingsContextProvider>
    </div>
  );
};

export default Responses;
