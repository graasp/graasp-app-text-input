import React from 'react';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import { List } from 'immutable';
import Stopword from 'stopword';
import Loader from '../../common/Loader';
import WordCloud from 'react-wordcloud';
import { makeStyles } from '@material-ui/core/styles';
import { useAppData } from '../../context/hooks';
import { useTranslation } from 'react-i18next';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import { wordCloudId } from '../../../config/selectors';

const formatWords = (appData) => {
  const wordArray = appData
    .filter((a) => a.type === APP_DATA_TYPES.INPUT)
    .map((a) => List(_.words(a.data?.text?.toLowerCase())))
    .flatten();

  // strip stopwords and create count map
  const strippedWordArray = Stopword.removeStopwords(wordArray.toJS());
  const wordMap = _.countBy(strippedWordArray);

  // prepare map in format required by word cloud
  const words = Object.entries(wordMap).map(([text, value]) => ({
    text,
    value,
  }));
  return words;
};

const useStyles = makeStyles({
  container: {
    // 64px is the height of the header
    height: 'calc(100% - 64px)',
    width: '100%',
  },
});

const TeacherDashboard = () => {
  const classes = useStyles;
  const { t } = useTranslation();
  const { data: appData, isLoading } = useAppData();

  if (isLoading) {
    return <Loader />;
  }

  if (!appData || appData.isEmpty()) {
    return (
      <Typography variant="h6" align="center">
        {t('No Responses to display')}
      </Typography>
    );
  }

  const words = formatWords(appData);

  return (
    <div id={wordCloudId} className={classes.container}>
      <WordCloud words={words} />
    </div>
  );
};

export default TeacherDashboard;
