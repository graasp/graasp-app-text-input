import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import {
  patchAppInstanceResource,
  postAppInstanceResource,
} from '../../../actions';
import { INPUT } from '../../../config/appInstanceResourceTypes';
import Loader from '../../common/Loader';

const styles = theme => ({
  main: {
    textAlign: 'center',
    flex: 1,
    padding: theme.spacing.unit,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'hidden',
  },
  message: {
    padding: theme.spacing.unit,
    backgroundColor: theme.status.danger.background[500],
    color: theme.status.danger.color,
    marginBottom: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class StudentView extends Component {
  state = {
    text: '',
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchPostAppInstanceResource: PropTypes.func.isRequired,
    dispatchPatchAppInstanceResource: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      main: PropTypes.object,
      message: PropTypes.object,
    }).isRequired,
    helperText: PropTypes.string,
    userId: PropTypes.string,
    inputResourceId: PropTypes.string,
    ready: PropTypes.bool,
    activity: PropTypes.bool,
    text: PropTypes.string,
  };

  static defaultProps = {
    helperText: '',
    userId: null,
    inputResourceId: null,
    activity: false,
    ready: false,
    text: null,
  };

  saveToApi = _.debounce(({ data }) => {
    const { dispatchPatchAppInstanceResource, inputResourceId } = this.props;
    if (inputResourceId) {
      dispatchPatchAppInstanceResource({ data, id: inputResourceId });
    }
  }, 1000);

  componentDidMount() {
    const { text } = this.props;
    this.createInputAppInstanceResource();
    if (text) {
      this.setState({ text });
    }
  }

  componentDidUpdate(
    {
      inputResourceId: prevInputAppInstanceResourceId,
      userId: prevUserId,
      text: prevPropText,
    },
    { text: prevStateText }
  ) {
    const { inputResourceId, text, userId } = this.props;

    if (
      inputResourceId !== prevInputAppInstanceResourceId ||
      userId !== prevUserId ||
      !inputResourceId
    ) {
      this.createInputAppInstanceResource();
    }

    // set state here safely by ensuring that it does not cause an infinite loop
    if (prevPropText !== text && prevStateText !== text) {
      // eslint-disable-next-line
      this.setState({ text });
    }
  }

  createInputAppInstanceResource = () => {
    const {
      inputResourceId,
      dispatchPostAppInstanceResource,
      userId,
      ready,
      activity,
    } = this.props;
    // create the resource to save the text if it does not exist
    if (ready && !inputResourceId && !activity) {
      dispatchPostAppInstanceResource({ userId, data: '', type: INPUT });
    }
  };

  handleChangeText = ({ target }) => {
    const { value } = target;
    const { userId } = this.props;
    this.setState({
      text: value,
    });
    // only save if there is actually a userId
    if (userId) {
      this.saveToApi({ data: value });
    }
  };

  render() {
    const { t, classes, helperText, ready } = this.props;
    const { text } = this.state;

    if (!ready) {
      return <Loader />;
    }

    return (
      <Grid container spacing={0}>
        <Grid item xs={12} className={classes.main}>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              autoFocus
              key="inputTextField"
              id="inputTextField"
              label={t('Type Here')}
              multiline
              rowsMax="5"
              value={text}
              onChange={this.handleChangeText}
              className={classes.textField}
              margin="normal"
              helperText={helperText}
              variant="outlined"
              fullWidth
            />
          </form>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = ({ context, appInstanceResources }) => {
  const { userId } = context;
  const inputResource = appInstanceResources.content.find(({ user, type }) => {
    return user === userId && type === INPUT;
  });

  return {
    userId,
    inputResourceId: inputResource && inputResource._id,
    activity: Boolean(appInstanceResources.activity.length),
    ready: appInstanceResources.ready,
    text: inputResource && inputResource.data,
  };
};

const mapDispatchToProps = {
  dispatchPostAppInstanceResource: postAppInstanceResource,
  dispatchPatchAppInstanceResource: patchAppInstanceResource,
};

const StyledComponent = withStyles(styles)(StudentView);

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledComponent);

export default withTranslation()(ConnectedComponent);
