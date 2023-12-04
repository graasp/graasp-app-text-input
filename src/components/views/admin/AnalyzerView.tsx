import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import { removeStopwords } from 'stopword';
import Loader from '../../common/Loader';
import WordCloud from 'react-wordcloud';
import { hooks } from '../../../config/queryClient';
import { useTranslation } from 'react-i18next';
import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import { wordCloudId } from '../../../config/selectors';
import { AppData } from '@graasp/sdk';
import countBy from 'lodash.countby';
import words from 'lodash.words';

const formatWords = (appData: AppData[]) => {
  const wordArray = appData
    .filter((a) => a.type === APP_DATA_TYPES.INPUT)
    .map((a) => words((a.data?.text as string)?.toLowerCase()))
    .flat();

  // strip stopwords and create count map
  const strippedWordArray = removeStopwords(wordArray);
  const wordMap = countBy(strippedWordArray);

  // prepare map in format required by word cloud
  const newWords = Object.entries(wordMap).map(([text, value]) => ({
    text,
    value,
  }));
  return newWords;
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

  if (!appData?.length) {
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
