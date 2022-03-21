import React from 'react';
import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import isEmpty from 'lodash/isEmpty';
import { ProviderComponent, ProviderLoader, SignInProvider } from './types';
import { GridItem } from './styles';
import { UserIdentity } from './UserIdentity';
import { InfoCard } from '@backstage/core-components';

// accept base64url format according to RFC7515 (https://tools.ietf.org/html/rfc7515#section-3)
const ID_TOKEN_REGEX = /^[a-z0-9_\-]+\.[a-z0-9_\-]+\.[a-z0-9_\-]+$/i;

/** @public */
export type CustomProviderClassKey = 'form' | 'button';

const useFormStyles = makeStyles(
  theme => ({
    form: {
      display: 'flex',
      flexFlow: 'column nowrap',
    },
    button: {
      alignSelf: 'center',
      marginTop: theme.spacing(2),
    },
  }),
  { name: 'BackstageCustomProvider' },
);

type Data = {
  userId: string;
  idToken?: string;
};

const asInputRef = (renderResult: UseFormRegisterReturn) => {
  const { ref, ...rest } = renderResult;
  return {
    inputRef: ref,
    ...rest,
  };
};

const Component: ProviderComponent = ({ onSignInSuccess }) => {
  const classes = useFormStyles();
  const { register, handleSubmit, formState } = useForm<Data>({
    mode: 'onChange',
  });

  const { errors } = formState;

  const handleResult = ({ userId }: Data) => {
    onSignInSuccess(
      UserIdentity.fromLegacy({
        userId,
        profile: {
          email: `${userId}@example.com`,
        },
      }),
    );
  };

  return (
    <GridItem>
      <InfoCard title="Custom User" variant="fullHeight">
        <Typography variant="body1">
          Enter your own User ID and credentials.
          <br />
          This selection will not be stored.
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit(handleResult)}>
          <FormControl>
            <TextField
              {...asInputRef(register('userId', { required: true }))}
              label="User ID"
              margin="normal"
              error={Boolean(errors.userId)}
            />
            {errors.userId && (
              <FormHelperText error>{errors.userId.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <TextField
              {...asInputRef(
                register('idToken', {
                  required: false,
                  validate: token =>
                    !token ||
                    ID_TOKEN_REGEX.test(token) ||
                    'Token is not a valid OpenID Connect JWT Token',
                }),
              )}
              label="ID Token (optional)"
              margin="normal"
              autoComplete="off"
              error={Boolean(errors.idToken)}
            />
            {errors.idToken && (
              <FormHelperText error>{errors.idToken.message}</FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            className={classes.button}
            disabled={!formState?.isDirty || !isEmpty(errors)}
          >
            Continue
          </Button>
        </form>
      </InfoCard>
    </GridItem>
  );
};

// Custom provider doesn't store credentials
const loader: ProviderLoader = async () => undefined;

export const customProvider: SignInProvider = { Component, loader };