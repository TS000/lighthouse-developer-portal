import React, { PropsWithChildren } from 'react';
import { Chip, Divider, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import { Link } from '@backstage/core-components';
import TextTruncate from 'react-text-truncate';

const useStyles = makeStyles({
  flexContainer: {
    flexWrap: 'wrap',
  },
  itemText: {
    width: '100%',
    marginBottom: '1rem',
  },
});

export const DocsResultListItem = ({
  result,
  lineClamp = 5,
  asListItem = true,
  asLink = true,
  title,
}: {
  result: any;
  lineClamp?: number;
  asListItem?: boolean;
  asLink?: boolean;
  title?: string;
}) => {
  const classes = useStyles();
  const TextItem = () => (
    <ListItemText
      className={classes.itemText}
      primaryTypographyProps={{ variant: 'h6' }}
      primary={
        title
          ? title
          : `${result.title} | ${result.entityTitle ?? result.name} docs`
      }
      secondary={
        <TextTruncate
          line={lineClamp}
          truncateText="…"
          text={result.text}
          element="span"
        />
      }
    />
  );

  const LinkWrapper = ({ children }: PropsWithChildren<{}>) =>
    asLink ? <Link to={result.location}>{children}</Link> : <>{children}</>;

  const ListItemWrapper = ({ children }: PropsWithChildren<{}>) =>
    asListItem ? (
      <>
        <ListItem alignItems="flex-start" className={classes.flexContainer}>
          {children}
        </ListItem>
        <Divider component="li" />
      </>
    ) : (
      <>{children}</>
    );

  return (
    <LinkWrapper>
      <ListItemWrapper>
        <TextItem />
        <Chip label="Type: TechDocs" size="small" />
      </ListItemWrapper>
    </LinkWrapper>
  );
};
