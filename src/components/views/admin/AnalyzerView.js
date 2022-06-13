import React from 'react';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import { List } from 'immutable';
import { removeStopwords } from 'stopword';
import Loader from '../../common/Loader';
import WordCloud from 'react-wordcloud';
import { hooks } from '../../../config/queryClient';
import { useTranslation } from 'react-i18next';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import { wordCloudId } from '../../../config/selectors';

const formatWords = (appData) => {
  const wordArray = appData
    .filter((a) => a.type === APP_DATA_TYPES.INPUT)
    .map((a) => List(_.words(a.data?.text?.toLowerCase())))
    .flatten();

  // strip stopwords and create count map
  const strippedWordArray = removeStopwords(wordArray.toJS());
  const wordMap = _.countBy(strippedWordArray);

  // prepare map in format required by word cloud
  const words = Object.entries(wordMap).map(([text, value]) => ({
    text,
    value,
  }));
  return words;
};

const Container = styled('div')({
  // 64px is the height of the header
  height: 'calc(100% - 64px)',
  width: '100%',
});

const TeacherDashboard = () => {
  const { t } = useTranslation();
  const { data: appData, isLoading } = hooks.useAppData();

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
    <Container id={wordCloudId}>
      <WordCloud words={words} />
    </Container>
  );
};

export default TeacherDashboard;
