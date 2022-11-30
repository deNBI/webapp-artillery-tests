# Webapp Artillery Tests
This repository contains [Artillery](https://www.artillery.io/) tests leveraging [Playwright](https://playwright.dev/) 
to test the de.NBI Cloud [webapp](https://github.com/deNBI/cloud-portal-webapp).
# Setup
1. Clone this repository.
2. Make sure you have [nodeenv installed](https://github.com/ekalinin/nodeenv#install).
3. Run `make` to create a node environment and install all required packages from the package.json.
## Local
1. Copy the `payload/users.csv.in` to `payload/users.csv`.
2. In the `users.csv` add the username, password, and login type without quotes. Each row is one set of credentials.
   The user credentials are processed sequentially and looped if more virtual users are started than credentials provided.
   Looping credentials does not work if artillery is run in distributed mode.
3. Create a videos directory with `mkdir videos` if you want to have videos recorded.
## Staging
1. Copy the `payload/users.csv.in` to `payload/users.csv`.
2. In the `users.csv` add the username, password, and login type without quotes. Each row is one set of credentials.
   The user credentials are processed sequentially and looped if more virtual users are started than credentials provided.
   Looping credentials does not work if artillery is run in distributed mode.
3. Copy the `staging_auth.sh.in` to `staging_auth.sh` and change the variable values. No quotes needed.
   This allows playwright to make requests to a page secured by Haproxy Basic Auth.
# Usage
You may run a scenario either by using a script or by executing the command manually.
## Local
**Manually:** Source the environment with `source env/bin/activate` and run a scenario with `npm run test:local scenarios/yourScenario.yml`.  
**Script**: Set execution permissions on `run_local.sh` with `chmod u+x run_local.sh`. Run `./run_local.sh scenarios/yourScenario.yml`.
## Staging
**Manually:** Source the environment with `source env/bin/activate`, source the staging authentication variables with
`source staging_auth.sh` and run a scenario with `npm run test:staging scenarios/yourScenario.yml`.  
**Script**: Set execution permissions on `run_staging.sh` with `chmod u+x run_staging.sh`. Run `./run_staging.sh scenarios/yourScenario.yml`.
# Configuration
Configuration is done in two places. General configuration for every scenario is found in artillery.conf.yml.
Each scenario can have its own configuration.
## artillery.conf.yml
The environments local and staging have their own set of configurations.  
To disable video recording comment in the following lines:
```yaml
          contextOptions:
            recordVideo:
              dir: "./videos"
```  
To enable video recording for staging, add the lines above as in local environment.  
To see the browser interaction, change the option headless to false:
```yaml
          launchOptions:
            headless: false
```
## Scenario
Each scenario needs a processor file where it may find the flow function to run.  
For more information on phases and how they affect the number of users, please have a look at the official documentation
[here](https://www.artillery.io/docs/guides/guides/test-script-reference#phases---load-phases).
