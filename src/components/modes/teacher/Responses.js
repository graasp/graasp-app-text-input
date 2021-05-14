import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import { List } from 'immutable';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Response from './Response';
import { RESPONSES_COLUMNS } from '../../../config/settings';
import {
  responsesTableCypress,
  tableNoResponsesCypress,
} from '../../../config/selectors';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
}));

const Responses = ({ students, appData }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const anonymousUser = {
    name: t('Anonymous'),
  };

  const renderAppInstanceResources = () => {
    // if there are no resources, show an empty table
    if (appData.isEmpty()) {
      return (
        <TableRow data-cy={tableNoResponsesCypress}>
          <TableCell align="center" colSpan={4}>
            {t('No Responses')}
          </TableCell>
        </TableRow>
      );
    }

    const responses = appData.filter(
      ({ type }) => type === APP_DATA_TYPES.INPUT
    );
    const feedbacks = appData.filter(
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
      <Paper className={classes.root}>
        <Table data-cy={responsesTableCypress} className={classes.table}>
          <TableHead>
            <TableRow>
              {RESPONSES_COLUMNS.map((column) => (
                <TableCell key={column}>{t(column)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{renderAppInstanceResources()}</TableBody>
        </Table>
      </Paper>
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
