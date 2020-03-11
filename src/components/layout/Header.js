import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import CloudIcon from '@material-ui/icons/Cloud';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import { IconButton } from '@material-ui/core';
import TableIcon from '@material-ui/icons/TableChart';
import RefreshIcon from '@material-ui/icons/Refresh';
import { CSVLink } from 'react-csv';
import { withTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../../resources/logo.svg';
import { DEFAULT_MODE, TEACHER_MODES } from '../../config/settings';
import { DEFAULT_VIEW, DASHBOARD_VIEW } from '../../config/views';
import './Header.css';
import { addQueryParamsToUrl } from '../../utils/url';
import { getAppInstanceResources, getUsers } from '../../actions';

class Header extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchGetAppInstanceResources: PropTypes.func.isRequired,
    dispatchGetUsers: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      grow: PropTypes.string,
      logo: PropTypes.string,
    }).isRequired,
    mode: PropTypes.string,
    view: PropTypes.string,
    appInstanceResources: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.string.isRequired,
        user: PropTypes.string.isRequired,
      })
    ),
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  };

  static styles = theme => ({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    logo: {
      height: '48px',
      marginRight: theme.spacing.unit * 2,
    },
  });

  static defaultProps = {
    mode: DEFAULT_MODE,
    view: DEFAULT_VIEW,
    appInstanceResources: [],
    users: [],
  };

  handleRefresh = () => {
    const { dispatchGetAppInstanceResources, dispatchGetUsers } = this.props;
    dispatchGetAppInstanceResources();
    dispatchGetUsers();
  };

  downloadCSVButton = () => {
    const { appInstanceResources, users, t } = this.props;

    if (!appInstanceResources.length || !users.length) {
      return null;
    }

    const csvData = appInstanceResources.map(({ data, user }) => {
      const userData = users.find(({ id }) => id === user);
      const name = userData ? userData.name : t('Anonymous');
      return { name, data };
    });
    return (
      <CSVLink data={csvData}>
        <DownloadIcon nativeColor="#fff" />
      </CSVLink>
    );
  };

  renderViewButtons() {
    const { mode, view } = this.props;

    if (TEACHER_MODES.includes(mode)) {
      const buttons = [
        <IconButton onClick={this.handleRefresh} key="refresh">
          <RefreshIcon nativeColor="#fff" />
        </IconButton>,
        this.downloadCSVButton(),
      ];

      if (view === DEFAULT_VIEW) {
        buttons.push(
          <IconButton
            key="dashboard"
            href={`index.html${addQueryParamsToUrl({ view: DASHBOARD_VIEW })}`}
          >
            <CloudIcon nativeColor="#fff" />
          </IconButton>
        );
      } else {
        buttons.push(
          <IconButton
            key="table"
            href={`index.html${addQueryParamsToUrl({ view: DEFAULT_VIEW })}`}
          >
            <TableIcon nativeColor="#fff" />
          </IconButton>
        );
      }
      return buttons;
    }
    return null;
  }

  render() {
    const { t, classes } = this.props;
    return (
      <header>
        <AppBar position="static">
          <Toolbar>
            <Logo className={classes.logo} />
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {t('Input')}
            </Typography>
            {this.renderViewButtons()}
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}

const mapStateToProps = ({ context, appInstanceResources, users }) => ({
  appInstanceResources: appInstanceResources.content,
  appInstanceId: context.appInstanceId,
  spaceId: context.spaceId,
  mode: context.mode,
  view: context.view,
  users: users.content,
});

const mapDispatchToProps = {
  dispatchGetAppInstanceResources: getAppInstanceResources,
  dispatchGetUsers: getUsers,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withStyles(Header.styles)(TranslatedComponent);
