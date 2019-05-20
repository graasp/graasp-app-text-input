import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import CloudIcon from '@material-ui/icons/Cloud';
import { IconButton } from '@material-ui/core';
import TableIcon from '@material-ui/icons/TableChart';
import { withTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../../resources/logo.svg';
import { DEFAULT_MODE, TEACHER_MODES } from '../../config/settings';
import { DEFAULT_VIEW, DASHBOARD_VIEW } from '../../config/views';
import './Header.css';
import { addQueryParamsToUrl } from '../../utils/url';

class Header extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.shape({}).isRequired,
    mode: PropTypes.string,
    view: PropTypes.string,
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
  };

  renderViewButtons() {
    const { mode, view } = this.props;
    if (TEACHER_MODES.includes(mode)) {
      if (view === DEFAULT_VIEW) {
        return (
          <IconButton href={addQueryParamsToUrl({ view: DASHBOARD_VIEW })}>
            <CloudIcon nativeColor="#fff" />
          </IconButton>
        );
      }
      return (
        <IconButton href={addQueryParamsToUrl({ view: DEFAULT_VIEW })}>
          <TableIcon nativeColor="#fff" />
        </IconButton>
      );
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

const mapStateToProps = ({ context }) => ({
  appInstanceId: context.appInstanceId,
  spaceId: context.spaceId,
  mode: context.mode,
  view: context.view,
});

const ConnectedComponent = connect(mapStateToProps)(Header);
const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withStyles(Header.styles)(TranslatedComponent);
