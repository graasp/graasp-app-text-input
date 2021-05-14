import React, { useContext } from 'react';
import StudentView from './modes/student/StudentView';
import { DEFAULT_PERMISSION } from '../config/settings';
import TeacherMode from './modes/teacher/TeacherMode';
import Header from './layout/Header';
import { TokenProvider } from './context/TokenContext';
import { Context } from './context/ContextContext';

export const App = () => {
  const context = useContext(Context);

  const renderContent = () => {
    switch (context?.get('permission', DEFAULT_PERMISSION)) {
      // show teacher view when in producer (educator) mode
      case 'write':
      case 'admin':
        // case permission:
        return (
          <>
            <Header />
            <TeacherMode />
          </>
        );

      // by default go with the consumer (learner) mode
      case 'read':
      default:
        return (
          <>
            {(context?.get('permission')?.headerVisible ||
              context?.get('standalone')) && <Header />}
            <StudentView />
          </>
        );
    }
  };

  return <TokenProvider>{renderContent()}</TokenProvider>;
};

export default App;
