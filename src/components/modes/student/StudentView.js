import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
  getAppInstanceResources,
  patchAppInstanceResource,
  postAppInstanceResource,
} from '../../../actions';
import { FEEDBACK, INPUT } from '../../../config/appInstanceResourceTypes';
import Loader from '../../common/Loader';
import { MAX_INPUT_LENGTH, MAX_ROWS } from '../../../config/settings';

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
  button: {
    marginRight: theme.spacing.unit,
  },
});

class StudentView extends Component {
  state = {
    text: '',
    createdInputResource: false,
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchPostAppInstanceResource: PropTypes.func.isRequired,
    dispatchPatchAppInstanceResource: PropTypes.func.isRequired,
    dispatchGetAppInstanceResources: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      main: PropTypes.string,
      container: PropTypes.string,
      message: PropTypes.string,
      button: PropTypes.string,
      textField: PropTypes.string,
    }).isRequired,
    feedback: PropTypes.string,
    userId: PropTypes.string,
    inputResourceId: PropTypes.string,
    ready: PropTypes.bool,
    offline: PropTypes.bool,
    standalone: PropTypes.bool.isRequired,
    activity: PropTypes.bool,
    text: PropTypes.string,
  };

  static defaultProps = {
    feedback: '',
    userId: null,
    inputResourceId: null,
    activity: false,
    ready: false,
    offline: false,
    text: null,
  };

  saveToApi = _.debounce(({ data }) => {
    const { dispatchPatchAppInstanceResource, inputResourceId } = this.props;
    if (inputResourceId) {
      dispatchPatchAppInstanceResource({ data, id: inputResourceId });
    }
  }, 1000);

  constructor(props) {
    super(props);
    const { userId } = props;
    // get the resources for this user
    props.dispatchGetAppInstanceResources({ userId });
  }

  componentDidMount() {
    const { text, offline } = this.props;

    // on mount creation of app instance resource only online
    if (!offline) {
      this.createInputAppInstanceResource();
    }
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
    const { inputResourceId, text, userId, offline } = this.props;

    // on update creation of app instance resource only online
    if (!offline) {
      if (
        inputResourceId !== prevInputAppInstanceResourceId ||
        userId !== prevUserId ||
        !inputResourceId
      ) {
        this.createInputAppInstanceResource();
      }
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
    const { createdInputResource } = this.state;

    // only create this resource once
    if (!createdInputResource) {
      // if there is no user id we cannot create the resource, so abort,
      // otherwise create the resource to save the text if it does not exist
      if (userId && ready && !inputResourceId && !activity) {
        dispatchPostAppInstanceResource({ userId, data: '', type: INPUT });
        this.setState({ createdInputResource: true });
      }
    }
  };

  handleChangeText = ({ target }) => {
    const { value } = target;
    const { userId, offline } = this.props;
    this.setState({
      text: value,
    });
    // only save automatically if online and there is actually a userId
    if (!offline && userId) {
      this.saveToApi({ data: value });
    }
  };

  handleClickSaveText = () => {
    const { text } = this.state;
    const {
      dispatchPatchAppInstanceResource,
      dispatchPostAppInstanceResource,
      inputResourceId,
      userId,
    } = this.props;

    // if there is a resource id already, update, otherwise create
    if (inputResourceId) {
      dispatchPatchAppInstanceResource({
        data: text,
        id: inputResourceId,
      });
    } else {
      dispatchPostAppInstanceResource({
        data: text,
        type: INPUT,
        userId,
      });
    }
  };

  renderButton() {
    const { t, offline, classes } = this.props;

    // button is only visible offline
    if (!offline) {
      return null;
    }
    return (
      <div align="right" className={classes.button}>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleClickSaveText}
        >
          {t('Save')}
        </Button>
      </div>
    );
  }

  render() {
    const { t, classes, ready, standalone } = this.props;
    const { text } = this.state;
    let { feedback } = this.props;
    if (feedback && feedback !== '') {
      feedback = `${t('Feedback')}: ${feedback}`;
    }

    if (!standalone && !ready) {
      return <Loader />;
    }

    return (
      <Grid container spacing={0}>
        <Grid item xs={12} className={classes.main}>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              autoFocus
              inputProps={{
                maxLength: MAX_INPUT_LENGTH,
              }}
              key="inputTextField"
              id="inputTextField"
              label={t('Type Here')}
              multiline
              rowsMax={MAX_ROWS}
              value={text}
              onChange={this.handleChangeText}
              className={classes.textField}
              margin="normal"
              helperText={feedback}
              variant="outlined"
              fullWidth
            />
          </form>
          {this.renderButton()}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = ({ context, appInstanceResources }) => {
  const { userId, offline, standalone } = context;
  const inputResource = appInstanceResources.content.find(({ user, type }) => {
    return user === userId && type === INPUT;
  });
  const feedbackResource = appInstanceResources.content.find(
    ({ user, type }) => {
      return user === userId && type === FEEDBACK;
    }
  );

  return {
    userId,
    offline,
    standalone,
    inputResourceId: inputResource && (inputResource.id || inputResource._id),
    activity: Boolean(appInstanceResources.activity.length),
    ready: appInstanceResources.ready,
    text: inputResource && inputResource.data,
    feedback: feedbackResource && feedbackResource.data,
  };
};

const mapDispatchToProps = {
  dispatchGetAppInstanceResources: getAppInstanceResources,
  dispatchPostAppInstanceResource: postAppInstanceResource,
  dispatchPatchAppInstanceResource: patchAppInstanceResource,
};

const StyledComponent = withStyles(styles)(StudentView);

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledComponent);

export default withTranslation()(ConnectedComponent);
