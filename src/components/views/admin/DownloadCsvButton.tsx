import { CSVLink as CsvLink } from 'react-csv';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import { useTranslation } from 'react-i18next';
import { Parser } from '@json2csv/plainjs';
import { ACTION_TYPES } from '../../../config/actionTypes';
import { hooks } from '../../../config/queryClient';
import { groupBy } from 'lodash';

const DownloadCsvButton = () => {
  const { t } = useTranslation();
  const { data: appData } = hooks.useAppData();
  const { data: context } = hooks.useAppContext();

  // if there are no users or no app instance resources do not show button
  if (appData && !context?.members?.length) {
    const formattedData = Object.entries(
      groupBy(appData, (data) => data.member.id)
    )?.map(([memberId, elements]) => {
      try {
        const userData = context?.members.find(({ id }) => id === memberId);
        const name = userData ? userData.name : t('Anonymous');

        // fall back to empty object in case there is no match
        const { data: input } =
          elements.find(({ type }) => type === ACTION_TYPES.SAVED) || {};
        // if there is no input, we ignore this entry
        if (!input) {
          return undefined;
        }

        const entry: { name: string; input: unknown; feedback?: unknown } = {
          name,
          input,
        };

        // export feedback if any
        const feedback = elements.find(
          ({ type }) => type === ACTION_TYPES.FEEDBACK
        );
        if (feedback) {
          entry.feedback = feedback.data;
        }
        return entry;
      } catch (error) {
        return undefined;
      }
    });

    // do not show download button if there is an issue parsing the data
    let csvData;
    try {
      const json2csvParser = new Parser();
      csvData = json2csvParser.parse(Object.values(formattedData));
    } catch {
      return null;
    }

    return (
      <CsvLink data={csvData} filename="data.csv">
        <IconButton>
          <DownloadIcon color="secondary" />
        </IconButton>
      </CsvLink>
    );
  }

  return null;
};

export default DownloadCsvButton;
