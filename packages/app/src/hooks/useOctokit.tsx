import { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import { OctokitOptions } from '@octokit/core/dist-types/types';

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
  const [octokit, setOctokit] = useState<Octokit>();

  /**
   * Attempts to parse a json string.
   * Returns undefined on error.
   *
   * @returns {object | undefined} - returns the parsed object if successful, otherwise returns undefined
   */
  const safeJSONParse = (str: string) => {
    try {
      return str && JSON.parse(str);
    } catch (error) {
      return undefined;
    }
  };

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

  // Creates the octokit instance with an authorized user if present.
  useEffect(() => {
    // Obtain user GitHub session from localStorage
    const userGithubSession = localStorage.getItem('githubSession');

    const parsedSession = safeJSONParse(userGithubSession || '');

    const octokitOptions: OctokitOptions = {
      userAgent: 'lighthouse-developer-portal',
    };

    if (
      parsedSession &&
      parsedSession.providerInfo &&
      parsedSession.providerInfo.accessToken
    ) {
      octokitOptions.auth = parsedSession.providerInfo.accessToken;
    }

    setOctokit(new Octokit(octokitOptions));
  }, []);

  return {
    octokit,
    getCurrentUser,
    createNewIssue,
  };
};
