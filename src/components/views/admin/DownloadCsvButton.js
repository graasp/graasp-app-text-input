import React from 'react';
import { CSVLink as CsvLink } from 'react-csv';
import { IconButton } from '@material-ui/core';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import { useTranslation } from 'react-i18next';
import { Parser } from 'json2csv';
import { ACTION_TYPES } from '../../../config/actionTypes';
import { hooks } from '../../../config/queryClient';

const DownloadCsvButton = () => {
  const { t } = useTranslation();
  const { data: appData, isLoading: isAppDataLoading } = hooks.useAppData();
  const { data: context, isLoading: isAppContextLoading } =
    hooks.useAppContext();

  // if there are no users or no app instance resources do not show button
  if (
    (!isAppDataLoading && appData.isEmpty()) ||
    (!isAppContextLoading && !context?.get('members')?.length)
  ) {
    return null;
  }

  const formattedData = appData
    ?.groupBy((data) => data.memberId)
    ?.map((elements, memberId) => {
      try {
        const userData = context
          ?.get('members')
          .find(({ id }) => id === memberId);
        const name = userData ? userData.name : t('Anonymous');

        // fall back to empty object in case there is no match
        const { data: input } =
          elements.find(({ type }) => type === ACTION_TYPES.INPUT) || {};
        // if there is no input, we ignore this entry
        if (!input) {
          return undefined;
        }

        const entry = { name, input };

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
    csvData = json2csvParser.parse(Object.values(formattedData?.toJS()));
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
};

export default DownloadCsvButton;
