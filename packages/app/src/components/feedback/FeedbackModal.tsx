import React, { ChangeEvent, ReactElement, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tabs,
  Tab,
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  makeStyles,
} from '@material-ui/core';
import RateReviewIcon from '@material-ui/icons/RateReview';
import CloseIcon from '@material-ui/icons/Close';
import {
  SidebarItem,
  DismissableBanner,
  Link,
} from '@backstage/core-components';
import { useOctokit } from '../../hooks/useOctokit';

export interface TabPanelProps {
  value: number;
  index: number;
  children: ReactElement;
}

/**
 * Close button styles
 */
const useStyles = makeStyles({
  root: {
    top: '8px',
    color: '#9e9e9e',
    right: '8px',
    position: 'absolute',
  },
});

/**
 * TabPanel used for the material ui tab component. Used to present information.
 */
export const TabPanel = (props: TabPanelProps): ReactElement => {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export interface SearchModalProps {
  open?: boolean;
  toggleModal: () => void;
}

/**
 * Modal containing a form to submit feedback for embark
 *
 * Submitted feedback will create a new issue on the lighthouse-embark repo
 */
export const Modal = ({
  open = false,
  toggleModal,
}: SearchModalProps): ReactElement => {
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [currentTab, setCurrentTab] = useState(0);
  const classes = useStyles();

  // Submitted feedback states
  const [hasSubmittedFeedback, setHasSubmittedFeedback] =
    useState<boolean>(false);
  const [hasFeedbackError, setHasFeedbackError] = useState<boolean>(false);

  const { createNewIssue } = useOctokit();

  /**
   * Updates the textarea input.
   *
   * @param event - input element event
   */
  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFeedbackText(event.target.value);
  };

  /**
   * Updates the currentTab
   *
   * @param _ - Not used
   * @param tabIndex - The new tab index value
   */
  const handleTabChange = (_: any, tabIndex: number) => {
    setCurrentTab(tabIndex);
  };

  /**
   * Attempts to submit the feedback from the textarea to the lighthouse-embark repo as an issue.
   */
  const handleFeedbackSubmit = async () => {
    try {
      await createNewIssue('lighthouse-embark feedback', feedbackText);
      setHasSubmittedFeedback(true);
      setFeedbackText('');
    } catch (error) {
      setHasFeedbackError(true);
    }

    toggleModal();
  };

  return (
    <>
      {hasSubmittedFeedback ? (
        <DismissableBanner
          message={
            <Typography>
              Feedback submitted!{' '}
              <Link
                to="https://github.com/department-of-veterans-affairs/lighthouse-embark/issues"
                style={{ color: 'white', textDecoration: 'underline' }}
              >
                View it on GitHub
              </Link>
              .
            </Typography>
          }
          variant="info"
          id="feedback_submit"
          fixed
        />
      ) : null}
      {hasFeedbackError ? (
        <DismissableBanner
          message="Failed to submit feedback. Please try again later."
          variant="warning"
          id="feedback_failed"
          fixed
        />
      ) : null}

      <Dialog
        onClose={toggleModal}
        aria-labelledby="search-modal-title"
        open={open}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          Provide feedback for Embark
          <IconButton
            aria-label="close"
            onClick={toggleModal}
            className={classes.root}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              padding: '0.5rem',
              border: '1px solid grey',
              borderRadius: '4px',
            }}
          >
            <Box sx={{ borderBottom: '1px solid grey' }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                aria-label="feedback-suggestions"
              >
                <Tab label="Have a suggestion?" />
                <Tab label="Found a bug?" />
              </Tabs>
            </Box>
            <TabPanel value={currentTab} index={0}>
              <List>
                <ListItem>Is the suggestion related to a problem?</ListItem>
                <ListItem>Describe the suggestion.</ListItem>
                <ListItem>
                  Describe alternatives that could be considered.
                </ListItem>
              </List>
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              <List>
                <ListItem>Describe the bug.</ListItem>
                <ListItem>Steps to reproduce.</ListItem>
                <ListItem>Expected behavior.</ListItem>
              </List>
            </TabPanel>
          </Box>
          <br />
          <Typography>
            Have more to say? You can provide more detail{' '}
            <Link to="https://github.com/department-of-veterans-affairs/lighthouse-embark/issues">
              here
            </Link>
            .
          </Typography>
          <br />
          <TextField
            label="Feedback content"
            variant="outlined"
            multiline
            fullWidth
            onChange={handleFormChange}
            value={feedbackText}
            minRows={5}
          />
          <br />
          <Typography color="textSecondary">
            *Expect a reply within 2 business days.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleFeedbackSubmit}
            type="submit"
            disabled={!feedbackText}
          >
            Submit
          </Button>
          <Button onClick={toggleModal} color="secondary" type="button">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

/**
 * The primary feedback component. Has a sidebar item that triggers a modal containing the feedback form.
 *
 * @returns - the react component
 */
export const FeedbackModal = (): ReactElement => {
  // Determines whether the modal is open/closed
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <Modal open={isOpen} toggleModal={() => setIsOpen(!isOpen)} />
      <SidebarItem
        className="search-icon"
        icon={RateReviewIcon}
        text="Feedback"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};
