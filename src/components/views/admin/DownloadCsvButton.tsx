import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import { useTranslation } from 'react-i18next';
import { Parser } from '@json2csv/plainjs';
import { hooks } from '../../../config/queryClient';
import groupBy from 'lodash.groupby';
import { APP_DATA_TYPES } from '@/config/appDataTypes';
import { Warning } from '@mui/icons-material';

const DownloadCsvButton = () => {
  const { t } = useTranslation();
  const { data: appData } = hooks.useAppData();
  const { data: context } = hooks.useAppContext();

  console.log(appData, context?.members);

  // if there are no users or no app instance resources do not show button
  if (appData && context?.members?.length) {
    const formattedData = Object.entries(
      groupBy(appData, (appData) => appData.member.id)
    )
      ?.map(([memberId, elements]) => {
        try {
          console.log(memberId, elements);
          const userData = context?.members.find(({ id }) => id === memberId);
          const name = userData ? userData.name : t('Anonymous');

          // fall back to empty object in case there is no match
          const maybeAppData = elements.find(
            ({ type }) => type === APP_DATA_TYPES.INPUT
          );
          // if there is no input, we ignore this entry
          if (!maybeAppData || !maybeAppData.data.text) {
            return undefined;
          }

          const entry: { name: string; input: unknown; feedback?: unknown } = {
            name,
            input: maybeAppData.data.text as string,
          };

          // export feedback if any
          const feedback = elements.find(
            ({ type }) => type === APP_DATA_TYPES.FEEDBACK
          );
          if (feedback) {
            entry.feedback = feedback.data;
          }
          return entry;
        } catch (error) {
          return undefined;
        }
      })
      .filter((e) => e);
    console.log(formattedData);

    // do not show download button if there is an issue parsing the data
    let csvData: string | null = null;
    try {
      const json2csvParser = new Parser();
      csvData = json2csvParser.parse(Object.values(formattedData));
    } catch (err) {
      console.error(err);
    }
    if (csvData) {
      return (
        <IconButton
          href={`data:application/octet-stream,${encodeURI(csvData)}`}
          download="data.csv"
        >
          <DownloadIcon color="secondary" />
        </IconButton>
      );
    }
    return <Warning color="error" />;
  }

  return null;
};

export default DownloadCsvButton;
