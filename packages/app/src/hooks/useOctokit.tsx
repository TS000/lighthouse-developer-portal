import { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import { OctokitOptions } from '@octokit/core/dist-types/types';
import { githubAuthApiRef, useApi } from '@backstage/core-plugin-api';

/**
 * React hook that create an Octokit instance.
 *
 * The hook will attempt to automatically authorize the current user using the GitHub session saved in localStorage.
 *
 * Uses the octokit/rest.js package to interact with the GitHub API
 *
 * @see https://octokit.github.io/rest.js/v18
 *
 * @returns
 */
export const useOctokit = () => {
  const auth = useApi(githubAuthApiRef);
  const [octokit, setOctokit] = useState<Octokit | null>();

  /**
   * Attempts to obtain the current GH authorized user information.
   */
  const getCurrentUser = async (): Promise<any> => {
    if (octokit) {
      return await octokit.request('/user');
    }
    return undefined;
  };

  /**
   * Attempts to create a new issue for the lighthouse-developer-portal repo
   *
   * @see https://octokit.github.io/rest.js/v18#issues-create
   */
  const createNewIssue = async (title: string, body: string) => {
    if (title && body && octokit) {
      return await octokit.rest.issues.create({
        owner: 'department-of-veterans-affairs',
        repo: 'lighthouse-developer-portal',
        title: title,
        body: body,
      });
    }
    return undefined;
  };

  /**
   * Obtains the users gh access token and initializes octokit
   */
  const initializeOctokit = async () => {
    try {
      const token = await auth.getAccessToken();

      if (typeof token !== 'string') {
        throw new Error('Token not found');
      }
      
      const octokitOptions: OctokitOptions = {
        userAgent: 'lighthouse-developer-portal',
        auth: token,
      };


      setOctokit(new Octokit(octokitOptions));
    } catch (error) {
      setOctokit(null);
    }
  };

  // Creates the octokit instance with an authorized user if present.
  useEffect(() => {
    const user = localStorage.getItem('@backstage/core:SignInPage:provider');

    // Prevent asking for gitHub auth if the user is a guest
    if (user !== 'guest') {
      initializeOctokit();
    }
    // eslint-disable-next-line
  }, []);

  return {
    octokit,
    getCurrentUser,
    createNewIssue,
  };
};
