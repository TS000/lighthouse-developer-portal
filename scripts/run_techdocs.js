
const ghpages = require('gh-pages');
const fs = require('fs');
const { exec } = require("child_process");
const { Octokit } = require("@octokit/core");
const octokit = new Octokit();
/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
 function execShellCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error({error});
                reject(stderr)
            }
            resolve(stdout);
        });
    });
}


/**
 * Removes directory if it exists.
 * @param {string} dir - direcotory to remove
 */
 async function rmDir(dir) {
    if (fs.existsSync(dir)) {
        await execShellCommand(`rm -rf ${dir}`)
    }
}


/**
 * Clones a repo to a specifie directory.
 * @param {string} url - url of remote repo
 * @param {string} dir - directory to clone into
 */
 async function cloneRepo(url, dir) {
     console.log('cloning...')
    await rmDir(dir)
    const shellCommand = `git clone ${url} ${dir}`
    try {
        await execShellCommand(shellCommand)
    } catch(error) {
        console.log(error)
    }
}

/**
 * Generates documention from a specified directory to the default ./site directory.
 * @param {string} dir - source directory for documentation
 */
 async function buildDocs(dir) {
    console.log('Builing...')
    await rmDir('./site')

    // fail building documentation if mkdocs file is not present
    if (!fs.existsSync(`${dir}/mkdocs.yml`)) {
        console.log('mkdocs.yml must be present to build documentation')
    }
    const shellCommand = `techdocs-cli generate --source-dir ${dir}`
    try {
        await execShellCommand(shellCommand)
    } catch(error) {
        console.log({ error })
    }
}

/**
 * Publishes documentation to a specified repo.
 * @param {string} url - repo url
 * @info https://techsparx.com/software-development/git/jenkins-access.html
 */
 async function publishDocs(url) {
     console.log('Publishing...')
     //https://github.com/mhyder1/docs-2.git
    //  'https://github.com/backstage/techdocs-cli.git'
    ghpages.publish('site', {
        // user: {
        //     name: 'Muhammad Abdusamad',
        //     email: 'mhyder1@gmail.com'
        //   },
        branch: 'gh-pages',
        // repo: url,
        repo: `https://${process.env.ghpages_token}@github.com/mhyder1/docs-2.git`
        // repo: 'https://github.com/backstage/techdocs-cli.git'
    }, (error) => {
        if (error) console.log({ error })
    })
}

//'https://dev.devportal.name/api/catalog/entities?filter=kind=component'

const repos = [
    'https://github.com/department-of-veterans-affairs/lighthouse-backstage',
    // 'https://github.com/department-of-veterans-affairs/lighthouse-di-api-styleguide',
    // 'https://github.com/department-of-veterans-affairs/lighthouse-di-api-styleguide'
]

async function runTechdocs() {
    const dir = 'temp'
    // const { data } = await octokit.request('https://dev.devportal.name/api/catalog/entities?filter=kind=component')
    // console.log(data[0])
    repos.forEach( async repo => {
        await cloneRepo(`${repo}.git`, dir)
        await buildDocs(dir)
        await publishDocs()
    })
    
}

runTechdocs()