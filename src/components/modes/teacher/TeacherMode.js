import React, { useContext } from 'react';
import TeacherView from './TeacherView';
import TeacherDashboard from './TeacherDashboard';
import { CONTEXTS } from '../../../config/contexts';
import { Context } from '../../context/ContextContext';

const TeacherMode = () => {
  const context = useContext(Context);
  switch (context?.get('context')) {
    case CONTEXTS.ANALYZER:
      return <TeacherDashboard />;
    case CONTEXTS.BUILDER:
    default:
      return <TeacherView />;
  }
};

export default TeacherMode;
