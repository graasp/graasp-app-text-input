import React from 'react';
import PropTypes from 'prop-types';
import TeacherView from './TeacherView';
import TeacherDashboard from './TeacherDashboard';
import { DEFAULT_VIEW, DASHBOARD_VIEW } from '../../../config/views';

const TeacherMode = ({ view }) => {
  switch (view) {
    case DASHBOARD_VIEW:
      return <TeacherDashboard />;
    case DEFAULT_VIEW:
    default:
      return <TeacherView />;
  }
};

TeacherMode.propTypes = {
  view: PropTypes.string,
};

TeacherMode.defaultProps = {
  view: 'normal',
};

export default TeacherMode;
