
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
    console.log(`cloning into ${dir}`)
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
 * @param {string} outputDir - output directory for documentation
 */
 async function buildDocs(dir, outputDir) {
    console.log(`Builing docs from /${dir} into /${outputDir}`)

    // fail building documentation if mkdocs file is not present
    if (!fs.existsSync(`${dir}/mkdocs.yml`)) {
        console.log('mkdocs.yml must be present to build documentation')
    }

    const shellCommand = `techdocs-cli generate --source-dir ${dir} --output-dir ${outputDir}`
    try {
        await execShellCommand(shellCommand)
    } catch(error) {
        console.log({ error })
    }
}

/**
 * Publishes documentation to a specified repo.
 * @param {string} url - destination repo url for documentation
 * @param {string} dir - directory documentation is published from
 * @info https://techsparx.com/software-development/git/jenkins-access.html
 */
 async function publishDocs(url, dir) {
    console.log(`Publishing from /${dir}`)
    url = url.replace('https://', '')
    ghpages.publish(dir, {
        user: {
            name: 'Muhammad Abdusamad',
            email: 'mhyder1@gmail.com'
          },
        branch: 'gh-pages',
        repo: `https://${process.env.ghpages_token}@${url}.git`
    }, (error) => {
        if (error) console.log({ error })
    })
}

//'https://dev.devportal.name/api/catalog/entities?filter=kind=component'

const repos = [
    'https://github.com/mhyder1/docs-1',
    'https://github.com/mhyder1/docs-2',
    'https://github.com/mhyder1/docs-3',
    'https://github.com/mhyder1/docs-4',
]

async function runTechdocs() {
    // const dir = 'temp'
    // const { data } = await octokit.request('https://dev.devportal.name/api/catalog/entities?filter=kind=component')
    // console.log(data[0])
    repos.forEach( async repo => {
        const dir = repo.split('/').pop()
        const cloneDir = `${dir}-temp`
        const docsOutputDir = `${dir}-temp-site`
        await cloneRepo(`${repo}.git`, cloneDir)
        await buildDocs(cloneDir, docsOutputDir)
        await publishDocs(repo, `${docsOutputDir}`)
    })
    
}

runTechdocs()