import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material';
import { List } from 'immutable';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Response from './Response';
import { RESPONSES_COLUMNS } from '../../../config/settings';
import {
  responsesTableCypress,
  tableNoResponsesCypress,
} from '../../../config/selectors';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
  overflowX: 'auto',
}));

const StyledTable = styled(Table)({
  minWidth: 700,
});

const Responses = ({ students, appData }) => {
  const { t } = useTranslation();

  const anonymousUser = {
    name: t('Anonymous'),
  };

  const renderAppInstanceResources = () => {
    const nonEmptyData = appData.filter(({ data }) => Boolean(data?.text));

    // if there are no resources, show an empty table
    if (nonEmptyData.isEmpty()) {
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
    return responses.map(({ id, memberId, data }) => {
      const member = students.find((m) => m.id === memberId) ?? anonymousUser;
      const feedbackResource = feedbacks.find(
        ({ data: { memberId: mId } }) => mId === member.id
      );
      return (
        <Response
          id={id}
          key={id}
          student={member}
          data={data?.text}
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

Responses.propTypes = {
  appData: PropTypes.instanceOf(List),
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

Responses.defaultProps = {
  appData: List(),
  students: [],
};

export default Responses;
