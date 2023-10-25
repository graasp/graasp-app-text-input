import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Response from './Response';
import { RESPONSES_COLUMNS } from '../../../config/settings';
import {
  responsesTableCypress,
  tableNoResponsesCypress,
} from '../../../config/selectors';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import { AppData, Member } from '@graasp/sdk';

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
  overflowX: 'auto',
}));

const StyledTable = styled(Table)({
  minWidth: 700,
});

type Props = {
  students: Member[];
  appData: AppData[];
};

const Responses = ({ students, appData }: Props) => {
  const { t } = useTranslation();

  const renderAppInstanceResources = () => {
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
    return responses.map(({ id, member, data }) => {
      const m = students.find((m) => m.id === member.id);
      const feedbackResource = m
        ? feedbacks.find(({ data: { memberId: mId } }) => mId === m.id)
        : undefined;
      return (
        <Response
          id={id}
          key={id}
          student={m}
          data={data?.text as string}
          feedbackResource={feedbackResource}
        />
      );
    });
  };

  return (
    <div>
      <Typography variant="h6" color="inherit">
        {t('These are the responses submitted by the students.')}
      </Typography>
      <StyledPaper>
        <StyledTable data-cy={responsesTableCypress}>
          <TableHead>
            <TableRow>
              {RESPONSES_COLUMNS.map((column) => (
                <TableCell key={column}>{t(column)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{renderAppInstanceResources()}</TableBody>
        </StyledTable>
      </StyledPaper>
    </div>
  );
};

export default Responses;
