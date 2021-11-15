import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import { useSnackBar } from 'components/common/SnackBar';
import { useReport } from '../../store';
import { Loading, History } from '../../components';

const baseTranslationPath =
  'contractsAllocationReport.containers.historyListContainer';

const HistoryContainer = ({ history, match }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const { setSnackBarError } = useSnackBar();
  const { getHistory, clearState } = useReport();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchHistory = async () => {
      const result = await getHistory((match && match.params.id) || 0);
      setIsLoading(false);

      if (!result) {
        setSnackBarError(t(`${baseTranslationPath}.failedToFetchHistory`));
        return;
      }

      setHistoryData(result);
    };

    clearState();
    setIsLoading(true);
    fetchHistory();

    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      name: 'details',
      display: true,
      label: t(`${baseTranslationPath}.visualize`),
      basic: true,
      content: item => (
        <Tooltip title={t(`${baseTranslationPath}.details`)}>
          <Link
            component={RouterLink}
            to={`/alocacao-de-contratos/relatorio/${match.params.id}/historico/${item.revision}/detalhe`}
          >
            <IconButton>
              <Visibility />
            </IconButton>
          </Link>
        </Tooltip>
      )
    },
    {
      name: 'date',
      display: true,
      label: t(`${baseTranslationPath}.date`),
      basic: true,
      content: item => moment(item.changeAt).format('DD/MM/YYYY')
    },
    {
      name: 'user',
      display: true,
      label: t(`${baseTranslationPath}.user`),
      basic: true,
      content: item => item.user
    },
    {
      name: 'allocationDate',
      display: true,
      label: t(`${baseTranslationPath}.allocationDate`),
      basic: true,
      content: item => moment(item.referenceMonth).format('DD/MM/YYYY')
    },
    {
      name: 'balanceDate',
      display: true,
      label: t(`${baseTranslationPath}.balanceDate`),
      basic: true,
      content: item => moment(item.balanceDate).format('DD/MM/YYYY')
    },
    {
      name: 'icmsCost',
      display: true,
      label: t(`${baseTranslationPath}.icmsCost`),
      basic: true,
      content: item => item.ICMSCost
    },
    {
      name: 'icmsCostNotCreditable',
      display: true,
      label: t(`${baseTranslationPath}.icmsCostNotCreditable`),
      basic: true,
      content: item => item.ICMSCostNotCreditable
    },
    {
      name: 'editionStatus',
      display: true,
      label: t(`${baseTranslationPath}.editionStatus`),
      basic: true,
      content: item => t(`${baseTranslationPath}.${item.type}`)
    },
    {
      name: 'changeJustification',
      display: true,
      label: t(`${baseTranslationPath}.changeJustifications`),
      basic: true,
      content: item => item.changeJustification
    },
    {
      name: 'status',
      display: true,
      label: t(`${baseTranslationPath}.status`),
      basic: true,
      content: item => t(`${baseTranslationPath}.${item.type}`)
    }
  ];

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <History
          title="Histórico"
          data={historyData}
          columns={columns}
          goBack={() => history.push('/alocacao-de-contratos/relatorio')}
          divider={false}
          options={{ filter: true, filterType: 'radio' }}
          pagination={false}
        />
      )}
    </>
  );
};

export default HistoryContainer;
