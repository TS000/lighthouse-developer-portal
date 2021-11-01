/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 28,
  },
  path: {
    fill: '#FFFFFF',
  },
});

const LogoIcon = () => {
  const classes = useStyles();

  return (
    <svg
      className={classes.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 392 347"
      fill="none"
    >
      <path 
        className={classes.path}
        d="M76.1685 280L5 53.003H60.0216L87.0421 148.984C94.6253 176.267 101.547 201.864 106.814 230.157H107.801C113.402 202.874 120.324 175.932 127.9 150.001L156.242 53.003H209.615L134.815 280H76.1685Z" />

      <path 
        className={classes.path}
        d="M297.256 183.341L283.411 135.176C279.46 121.712 275.508 104.87 272.211 91.3923H271.557C268.259 104.87 264.962 122.039 261.337 135.176L248.161 183.341H297.256ZM240.905 221.74L225.092 279.997H173.361L240.905 53H306.807L376 279.997H321.639L304.497 221.74H240.905Z" />



    </svg>
  );
};

export default LogoIcon;
